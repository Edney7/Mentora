package com.example.mentora.service.falta;

import com.example.mentora.dto.falta.AlunoFaltasResumoDTO; // NOVO IMPORT
import com.example.mentora.dto.falta.FaltasPorDisciplinaDTO; // NOVO IMPORT
import com.example.mentora.dto.falta.FaltaCreateDTO;
import com.example.mentora.dto.falta.FaltaResponseDTO;

import com.example.mentora.model.*;
import com.example.mentora.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FaltaServiceImpl implements FaltaService {

    private static final Logger log = LoggerFactory.getLogger(FaltaServiceImpl.class);

    private final FaltaRepository faltaRepository;
    private final AlunoRepository alunoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final ProfessorRepository professorRepository;
    private final TurmaDisciplinaProfessorRepository turmaDisciplinaProfessorRepository;
    private final ProfessorDisciplinaRepository professorDisciplinaRepository;
    private final AulaRepository aulaRepository;

    @Autowired
    public FaltaServiceImpl(FaltaRepository faltaRepository,
                            AlunoRepository alunoRepository,
                            DisciplinaRepository disciplinaRepository,
                            ProfessorRepository professorRepository,
                            TurmaDisciplinaProfessorRepository turmaDisciplinaProfessorRepository,
                            ProfessorDisciplinaRepository professorDisciplinaRepository,
                            AulaRepository aulaRepository) {
        this.faltaRepository = faltaRepository;
        this.alunoRepository = alunoRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.professorRepository = professorRepository;
        this.turmaDisciplinaProfessorRepository = turmaDisciplinaProfessorRepository;
        this.professorDisciplinaRepository = professorDisciplinaRepository;
        this.aulaRepository = aulaRepository;
    }

    @Override
    @Transactional
    public FaltaResponseDTO registrarFalta(FaltaCreateDTO dto) {
        log.info("A registrar falta para aluno ID {}, aula ID {}, disciplina ID {}, data {}, por professor ID {}",
                dto.getAlunoId(),dto.getAulaId(), dto.getProfessorId(), dto.getDataFalta(), dto.getProfessorId());

        // 1. Buscar entidades principais
        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> {
                    log.warn("Aluno com ID {} não encontrado ao registrar falta.", dto.getAlunoId());
                    return new RuntimeException("Aluno com ID " + dto.getAlunoId() + " não encontrado.");
                });
        Aula aula = aulaRepository.findById(dto.getAulaId()) // <--- NOVO: Buscar a Aula
                .orElseThrow(() -> {
                    log.warn("Aula com ID {} não encontrada ao registrar falta.", dto.getAulaId());
                    return new RuntimeException("Aula com ID " + dto.getAulaId() + " não encontrada.");
                });
        Disciplina disciplinaDaAula = aula.getDisciplina();
        Turma turmaDaAula = aula.getTurma();
        LocalDate dataDaAula = aula.getDataAula();

        Professor professorQueRegistrou = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> {
                    log.warn("Professor com ID {} não encontrado ao registrar falta.", dto.getProfessorId());
                    return new RuntimeException("Professor com ID " + dto.getProfessorId() + " não encontrado.");
                });

        // 2. Validações de Negócio
        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            log.warn("Tentativa de registrar falta para aluno (Utilizador ID {}) inativo.", aluno.getUsuario() != null ? aluno.getUsuario().getId() : "N/A");
            throw new RuntimeException("Não é possível registrar falta para um aluno inativo.");
        }

        if (professorQueRegistrou.getUsuario() == null || !professorQueRegistrou.getUsuario().getAtivo()) {
            log.warn("Tentativa de registo de falta por professor (Utilizador ID {}) inativo.", professorQueRegistrou.getUsuario() != null ? professorQueRegistrou.getUsuario().getId() : "N/A");
            throw new RuntimeException("Professor inativo não pode registrar faltas.");
        }

        if (faltaRepository.existsByAlunoIdAndAulaId(aluno.getId(), aula.getId())) {
            log.warn("Já existe uma falta registada para o aluno ID {}, disciplina ID {}.", aluno.getId(), aula.getId());
            throw new RuntimeException("Já existe uma falta registada para este aluno nesta disciplina e data.");
        }

        Turma turmaDoAluno = aluno.getTurma();
        if (turmaDoAluno == null) {
            log.warn("Aluno ID {} não está associado a nenhuma turma.", aluno.getId());
            throw new RuntimeException("Aluno ID " + aluno.getId() + " não está associado a nenhuma turma.");
        }
        boolean disciplinaNaTurma = turmaDisciplinaProfessorRepository.findByTurmaId(turmaDoAluno.getId())
                .stream()
                .anyMatch(td -> td.getDisciplina().getId().equals(disciplinaDaAula.getId()));
        if (!disciplinaNaTurma) {
            log.warn("Disciplina ID {} não está associada à turma ID {} do aluno ID {}.",
                    professorQueRegistrou.getId() ,disciplinaDaAula.getId(), turmaDoAluno.getId(), aluno.getId());
            throw new RuntimeException("Disciplina ID " + disciplinaDaAula.getId() +
                    " não pertence à turma do aluno ID " + aluno.getId() + ".");
        }

        boolean professorLecionaDisciplina = professorDisciplinaRepository.findByProfessorId(professorQueRegistrou.getId())
                .stream()
                .anyMatch(pd -> pd.getDisciplina().getId().equals(aula.getDisciplina().getId()));
        if (!professorLecionaDisciplina) {
            log.warn("Professor ID {} não está autorizado a registrar faltas para a disciplina ID {}.",
                    professorQueRegistrou.getId(), disciplinaDaAula.getId());
            throw new RuntimeException("Professor ID " + professorQueRegistrou.getId() +
                    " não leciona a disciplina ID " + disciplinaDaAula.getId() + ".");
        }

        // 3. Criar e salvar a falta
        Falta falta = new Falta();
        falta.setAluno(aluno);
        falta.setAula(aula);

        falta.setProfessorQueRegistrou(professorQueRegistrou);

        falta.setJustificada(false);

        Falta faltaSalva = faltaRepository.save(falta);
        log.info("Falta ID {} registada com sucesso para aluno ID {}, disciplina ID {}, data {}, por professor ID {}.",
                faltaSalva.getId(), aluno.getId(), disciplinaDaAula.getId(), aula.getId(), professorQueRegistrou.getId());

        return toFaltaResponseDTO(faltaSalva);
    }



    @Override
    @Transactional(readOnly = true)
    public FaltaResponseDTO buscarFaltaPorId(Long id) {
        log.debug("A buscar falta com ID: {}", id);
        Falta falta = faltaRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Falta com ID {} não encontrada.", id);
                    return new RuntimeException("Falta com ID " + id + " não encontrada.");
                });
        return toFaltaResponseDTO(falta);
    }

    @Override
    public List<FaltaResponseDTO> listarTodasFaltas() {
        List<Falta> faltas = faltaRepository.findAll();
        return faltas.stream().map(this::toFaltaResponseDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FaltaResponseDTO> listarFaltasPorAluno(Long alunoId) {
        log.debug("A listar faltas para o aluno ID: {}", alunoId);
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno com ID " + alunoId + " não encontrado."));

        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            log.warn("Tentativa de listar faltas para aluno (Utilizador ID {}) inativo ou sem utilizador.", aluno.getUsuario() != null ? aluno.getUsuario().getId() : "N/A");
            return Collections.emptyList();
        }

        List<Falta> faltas = faltaRepository.findByAlunoId(alunoId);
        return toFaltaResponseDTOList(faltas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FaltaResponseDTO> listarFaltasPorAlunoEDisciplina(Long alunoId, Long disciplinaId) {
        log.debug("A listar faltas para o aluno ID: {} e disciplina ID: {}", alunoId, disciplinaId);
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno com ID " + alunoId + " não encontrado."));
        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            log.warn("Tentativa de listar faltas para aluno (Utilizador ID {}) inativo ou sem utilizador.", aluno.getUsuario() != null ? aluno.getUsuario().getId() : "N/A");
            return Collections.emptyList();
        }
        if (!disciplinaRepository.existsById(disciplinaId)) {
            throw new RuntimeException("Disciplina com ID " + disciplinaId + " não encontrada.");
        }

        List<Falta> faltas = faltaRepository.findByAlunoIdAndAula_DisciplinaId(alunoId, disciplinaId);
        return toFaltaResponseDTOList(faltas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FaltaResponseDTO> listarFaltasPorProfessor(Long professorId) {
        log.debug("A listar faltas registadas pelo professor ID: {}", professorId);
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor com ID " + professorId + " não encontrado."));
        if (professor.getUsuario() == null || !professor.getUsuario().getAtivo()) {
            log.warn("Tentativa de listar faltas para professor (Utilizador ID {}) inativo ou sem utilizador.", professor.getUsuario() != null ? professor.getUsuario().getId() : "N/A");
            return Collections.emptyList();
        }

        List<Falta> faltas = faltaRepository.findByProfessorQueRegistrouId(professorId);
        return toFaltaResponseDTOList(faltas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FaltaResponseDTO> listarFaltasPorData(LocalDate dataFalta) {
        log.debug("A listar faltas para a data: {}", dataFalta);
        List<Falta> faltas = faltaRepository.findByAula_DataFalta(dataFalta);
        return toFaltaResponseDTOList(faltas);
    }

    @Override
    @Transactional
    public void excluirFalta(Long faltaId) {
        log.info("A excluir falta ID: {}", faltaId);
        if (!faltaRepository.existsById(faltaId)) {
            log.warn("Falta com ID {} não encontrada para exclusão.", faltaId);
            throw new RuntimeException("Falta com ID " + faltaId + " não encontrada para exclusão.");
        }
        faltaRepository.deleteById(faltaId);
        log.info("Falta ID {} excluída com sucesso.", faltaId);
    }

    // --- NOVO MÉTODO PARA RESUMO DE FALTAS ---
    @Override
    @Transactional(readOnly = true)
    public AlunoFaltasResumoDTO buscarResumoFaltasPorAluno(Long alunoId) {
        log.debug("A buscar resumo de faltas para o aluno ID: {}", alunoId);
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> {
                    log.warn("Aluno com ID {} não encontrado ao buscar resumo de faltas.", alunoId);
                    return new RuntimeException("Aluno com ID " + alunoId + " não encontrado.");
                });

        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            log.warn("Tentativa de buscar resumo de faltas para aluno (Utilizador ID {}) inativo ou sem utilizador.", aluno.getUsuario() != null ? aluno.getUsuario().getId() : "N/A");
            return AlunoFaltasResumoDTO.builder()
                    .alunoId(alunoId)
                    .nomeAluno(aluno.getUsuario() != null ? aluno.getUsuario().getNome() : "Desconhecido")
                    .totalFaltas(0)
                    .faltasPorDisciplina(Collections.emptyList())
                    .aulasAssistidas(0)
                    .totalAulas(0)
                    .build();
        }

        // 1. Obter a turma do aluno
        Turma turmaDoAluno = aluno.getTurma();
        if (turmaDoAluno == null) {
            log.warn("Aluno ID {} não está associado a nenhuma turma.", alunoId);
            return AlunoFaltasResumoDTO.builder()
                    .alunoId(alunoId)
                    .nomeAluno(aluno.getUsuario().getNome())
                    .totalFaltas(0)
                    .faltasPorDisciplina(Collections.emptyList())
                    .aulasAssistidas(0)
                    .totalAulas(0)
                    .build();
        }

        // 2. Obter todas as faltas do aluno
        List<Falta> faltasDoAluno = faltaRepository.findByAlunoId(alunoId);

        // 3. Calcular Total de Faltas Geral
        int totalFaltasGeral = faltasDoAluno.size();

        // 4. Mapear as faltas por disciplina, utilizando a Aula
        // O mapa armazena: ID da Disciplina -> Contagem de Faltas
        Map<Long, Long> faltasContagemPorDisciplinaId = faltasDoAluno.stream()
                .filter(falta -> falta.getAula() != null && falta.getAula().getDisciplina() != null)
                .collect(Collectors.groupingBy(
                        falta -> falta.getAula().getDisciplina().getId(), // Agrupar pelo ID da Disciplina da Aula
                        Collectors.counting()
                ));

        // 5. Obter todas as disciplinas que a turma do aluno está cursando
        // Isso é importante para pegar as disciplinas mesmo que o aluno não tenha faltas nelas ainda
        List<Disciplina> disciplinasDaTurma = turmaDisciplinaProfessorRepository.findByTurmaId(turmaDoAluno.getId())
                .stream()
                .map(TurmaDisciplinaProfessor::getDisciplina)
                .distinct() // Garante que cada disciplina aparece apenas uma vez
                .collect(Collectors.toList());

        // 6. Popular o DTO de FaltasPorDisciplinaDTO para cada disciplina
        // Iteramos sobre as Disciplinas REAIS para pegar nome e ID corretamente
        List<FaltasPorDisciplinaDTO> faltasPorDisciplinaDTOs = disciplinasDaTurma.stream()
                .map(disciplina -> { // 'disciplina' AQUI é um objeto Disciplina (model/Disciplina.java)
                    long faltasNessaDisciplina = faltasContagemPorDisciplinaId.getOrDefault(disciplina.getId(), 0L);

                    // Contar o total de aulas para esta disciplina na turma do aluno
                    int totalAulasNessaDisciplina = aulaRepository.countByTurmaIdAndDisciplinaId(turmaDoAluno.getId(), disciplina.getId());

                    // Calcular aulas assistidas (presenças) para esta disciplina
                    int aulasAssistidasNessaDisciplina = totalAulasNessaDisciplina - (int) faltasNessaDisciplina;

                    return FaltasPorDisciplinaDTO.builder()
                            .disciplinaId(disciplina.getId())
                            .nomeDisciplina(disciplina.getNome())
                            .faltas((int) faltasNessaDisciplina)
                            // Opcional: Você pode adicionar aqui totalAulas e aulasAssistidas por disciplina
                            // .totalAulas(totalAulasNessaDisciplina)
                            // .aulasAssistidas(aulasAssistidasNessaDisciplina)
                            .build();
                })
                .collect(Collectors.toList());

        // 7. Calcular Total Geral de Aulas e Aulas Assistidas (para o resumo geral do aluno)
        int totalAulasGeral = 0;
        for (Disciplina disciplina : disciplinasDaTurma) {
            totalAulasGeral += aulaRepository.countByTurmaIdAndDisciplinaId(turmaDoAluno.getId(), disciplina.getId());
        }
        int aulasAssistidasGeral = totalAulasGeral - totalFaltasGeral;

        return AlunoFaltasResumoDTO.builder()
                .alunoId(alunoId)
                .nomeAluno(aluno.getUsuario().getNome())
                .totalFaltas(totalFaltasGeral)
                .faltasPorDisciplina(faltasPorDisciplinaDTOs)
                .aulasAssistidas(aulasAssistidasGeral)
                .totalAulas(totalAulasGeral)
                .build();
    }

    // Método auxiliar para converter uma entidade Falta para FaltaResponseDTO.
    private FaltaResponseDTO toFaltaResponseDTO(Falta falta) {
        Aluno aluno = falta.getAluno();
        Aula aula = falta.getAula(); // Obter a Aula
        Professor professorQueRegistrou = falta.getProfessorQueRegistrou(); // Professor que registrou

        String nomeAluno = (aluno != null && aluno.getUsuario() != null) ? aluno.getUsuario().getNome() : "Aluno não disponível";

        // Dados que vêm da Aula
        String nomeDisciplina = (aula != null && aula.getDisciplina() != null) ? aula.getDisciplina().getNome() : "Disciplina não disponível";
        Long disciplinaId = (aula != null && aula.getDisciplina() != null) ? aula.getDisciplina().getId() : null;
        LocalDate dataFalta = (aula != null) ? aula.getDataAula() : null; // Data da falta é a data da AULA

        // Dados do Professor que Registrou a Falta
        String nomeProfessorQueRegistrou = (professorQueRegistrou != null && professorQueRegistrou.getUsuario() != null) ? professorQueRegistrou.getUsuario().getNome() : "Professor não disponível";
        Long professorQueRegistrouId = (professorQueRegistrou != null) ? professorQueRegistrou.getId() : null;

        return FaltaResponseDTO.builder()
                .id(falta.getId())
                .dataFalta(dataFalta)
                .justificada(falta.getJustificada())
                .descricaoJustificativa(falta.getDescricaoJustificativa()) // Manter se o campo existir na sua entidade Falta
                .alunoId(aluno != null ? aluno.getId() : null)
                .nomeAluno(nomeAluno)
                .disciplinaId(disciplinaId)
                .nomeDisciplina(nomeDisciplina)
                .professorId(professorQueRegistrouId)
                .nomeProfessor(nomeProfessorQueRegistrou)
                .build();
    }

    // Método auxiliar para converter uma lista de entidades Falta para uma lista de FaltaResponseDTOs.
    private List<FaltaResponseDTO> toFaltaResponseDTOList(List<Falta> faltas) {
        return faltas.stream()
                .map(this::toFaltaResponseDTO)
                .collect(Collectors.toList());
    }
}