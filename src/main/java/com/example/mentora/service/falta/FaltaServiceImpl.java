package com.example.mentora.service.falta; // Ou o seu pacote de serviços

import com.example.mentora.dto.falta.FaltaCreateDTO;
import com.example.mentora.dto.falta.FaltaJustificativaDTO;
import com.example.mentora.dto.falta.FaltaResponseDTO;
import com.example.mentora.model.*; // Importar Aluno, Disciplina, Professor, Falta, Usuario, Turma
import com.example.mentora.repository.*; // Importar todos os repositórios necessários
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FaltaServiceImpl implements FaltaService {

    private static final Logger log = LoggerFactory.getLogger(FaltaServiceImpl.class);

    private final FaltaRepository faltaRepository;
    private final AlunoRepository alunoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final ProfessorRepository professorRepository;
    private final TurmaDisciplinaRepository turmaDisciplinaRepository;
    private final ProfessorDisciplinaRepository professorDisciplinaRepository;

    @Autowired
    public FaltaServiceImpl(FaltaRepository faltaRepository,
                            AlunoRepository alunoRepository,
                            DisciplinaRepository disciplinaRepository,
                            ProfessorRepository professorRepository,
                            TurmaDisciplinaRepository turmaDisciplinaRepository,
                            ProfessorDisciplinaRepository professorDisciplinaRepository) {
        this.faltaRepository = faltaRepository;
        this.alunoRepository = alunoRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.professorRepository = professorRepository;
        this.turmaDisciplinaRepository = turmaDisciplinaRepository;
        this.professorDisciplinaRepository = professorDisciplinaRepository;
    }

    @Override
    @Transactional
    public FaltaResponseDTO registarFalta(FaltaCreateDTO dto) {
        log.info("A registar falta para aluno ID {}, disciplina ID {}, data {}, por professor ID {}",
                dto.getAlunoId(), dto.getDisciplinaId(), dto.getDataFalta(), dto.getProfessorId());

        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> {
                    log.warn("Aluno com ID {} não encontrado ao registar falta.", dto.getAlunoId());
                    return new RuntimeException("Aluno com ID " + dto.getAlunoId() + " não encontrado.");
                });

        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> {
                    log.warn("Disciplina com ID {} não encontrada ao registar falta.", dto.getDisciplinaId());
                    return new RuntimeException("Disciplina com ID " + dto.getDisciplinaId() + " não encontrada.");
                });

        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> {
                    log.warn("Professor com ID {} não encontrado ao registar falta.", dto.getProfessorId());
                    return new RuntimeException("Professor com ID " + dto.getProfessorId() + " não encontrado.");
                });

        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            log.warn("Tentativa de registar falta para aluno (Utilizador ID {}) inativo.", aluno.getUsuario() != null ? aluno.getUsuario().getId() : "N/A");
            throw new RuntimeException("Não é possível registar falta para um aluno inativo.");
        }

        if (professor.getUsuario() == null || !professor.getUsuario().getAtivo()) {
            log.warn("Tentativa de registo de falta por professor (Utilizador ID {}) inativo.", professor.getUsuario() != null ? professor.getUsuario().getId() : "N/A");
            throw new RuntimeException("Professor inativo não pode registar faltas.");
        }

        if (faltaRepository.existsByAlunoIdAndDisciplinaIdAndDataFalta(aluno.getId(), disciplina.getId(), dto.getDataFalta())) {
            log.warn("Já existe uma falta registada para o aluno ID {}, disciplina ID {} na data {}.", aluno.getId(), disciplina.getId(), dto.getDataFalta());
            throw new RuntimeException("Já existe uma falta registada para este aluno nesta disciplina e data.");
        }

        Turma turmaDoAluno = aluno.getTurma();
        if (turmaDoAluno == null) {
            log.warn("Aluno ID {} não está associado a nenhuma turma.", aluno.getId());
            throw new RuntimeException("Aluno ID " + aluno.getId() + " não está associado a nenhuma turma.");
        }
        boolean disciplinaNaTurma = turmaDisciplinaRepository.findByTurmaId(turmaDoAluno.getId())
                .stream()
                .anyMatch(td -> td.getDisciplina().getId().equals(disciplina.getId()));
        if (!disciplinaNaTurma) {
            log.warn("Disciplina ID {} não está associada à turma ID {} do aluno ID {}.",
                    disciplina.getId(), turmaDoAluno.getId(), aluno.getId());
            throw new RuntimeException("Disciplina ID " + disciplina.getId() +
                    " não pertence à turma do aluno ID " + aluno.getId() + ".");
        }

        boolean professorLecionaDisciplina = professorDisciplinaRepository.findByProfessorId(professor.getId())
                .stream()
                .anyMatch(pd -> pd.getDisciplina().getId().equals(disciplina.getId()));
        if (!professorLecionaDisciplina) {
            log.warn("Professor ID {} não está autorizado a registar faltas para a disciplina ID {}.",
                    professor.getId(), disciplina.getId());
            throw new RuntimeException("Professor ID " + professor.getId() +
                    " não leciona a disciplina ID " + disciplina.getId() + ".");
        }

        Falta falta = new Falta();
        falta.setAluno(aluno);
        falta.setDisciplina(disciplina);
        falta.setProfessor(professor);
        falta.setDataFalta(dto.getDataFalta());
        falta.setJustificada(false);

        Falta faltaSalva = faltaRepository.save(falta);
        log.info("Falta ID {} registada com sucesso para aluno ID {}, disciplina ID {}, data {}, por professor ID {}.",
                faltaSalva.getId(), aluno.getId(), disciplina.getId(), faltaSalva.getDataFalta(), professor.getId());

        return toFaltaResponseDTO(faltaSalva);
    }

    @Override
    @Transactional
    public FaltaResponseDTO justificarFalta(Long faltaId, FaltaJustificativaDTO dto) {
        log.info("A justificar falta ID: {}", faltaId);
        Falta falta = faltaRepository.findById(faltaId)
                .orElseThrow(() -> {
                    log.warn("Falta com ID {} não encontrada para justificação.", faltaId);
                    return new RuntimeException("Falta com ID " + faltaId + " não encontrada.");
                });


        falta.setJustificada(true);
        falta.setDescricaoJustificativa(dto.getDescricaoJustificativa());

        Falta faltaAtualizada = faltaRepository.save(falta);
        log.info("Falta ID {} justificada com sucesso.", faltaAtualizada.getId());
        return toFaltaResponseDTO(faltaAtualizada);
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
            return Collections.emptyList(); // Ou lançar exceção
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
            return Collections.emptyList(); // Ou lançar exceção
        }
        if (!disciplinaRepository.existsById(disciplinaId)) {
            throw new RuntimeException("Disciplina com ID " + disciplinaId + " não encontrada.");
        }

        List<Falta> faltas = faltaRepository.findByAlunoIdAndDisciplinaId(alunoId, disciplinaId);
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
            return Collections.emptyList(); // Ou lançar exceção
        }

        List<Falta> faltas = faltaRepository.findByProfessorId(professorId);
        return toFaltaResponseDTOList(faltas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FaltaResponseDTO> listarFaltasPorData(LocalDate dataFalta) {
        log.debug("A listar faltas para a data: {}", dataFalta);
        List<Falta> faltas = faltaRepository.findByDataFalta(dataFalta);
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

    private FaltaResponseDTO toFaltaResponseDTO(Falta falta) {
        Aluno aluno = falta.getAluno();
        Disciplina disciplina = falta.getDisciplina();
        Professor professor = falta.getProfessor();

        String nomeAluno = (aluno != null && aluno.getUsuario() != null) ? aluno.getUsuario().getNome() : "Aluno não disponível";
        String nomeDisciplina = (disciplina != null) ? disciplina.getNome() : "Disciplina não disponível";
        String nomeProfessor = (professor != null && professor.getUsuario() != null) ? professor.getUsuario().getNome() : "Professor não disponível";

        return FaltaResponseDTO.builder()
                .id(falta.getId())
                .dataFalta(falta.getDataFalta())
                .justificada(falta.getJustificada())
                .descricaoJustificativa(falta.getDescricaoJustificativa())
                .alunoId(aluno != null ? aluno.getId() : null)
                .nomeAluno(nomeAluno)
                .disciplinaId(disciplina != null ? disciplina.getId() : null)
                .nomeDisciplina(nomeDisciplina)
                .professorId(professor != null ? professor.getId() : null)
                .nomeProfessor(nomeProfessor)
                .build();
    }

    private List<FaltaResponseDTO> toFaltaResponseDTOList(List<Falta> faltas) {
        return faltas.stream()
                .map(this::toFaltaResponseDTO)
                .collect(Collectors.toList());
    }
}
