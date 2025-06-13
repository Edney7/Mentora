package com.example.mentora.service.nota;

import com.example.mentora.dto.nota.NotaCreateDTO;
import com.example.mentora.dto.nota.NotaResponseDTO;
import com.example.mentora.dto.nota.NotaUpdateDTO; // Importar se for usar o método de atualização
import com.example.mentora.model.Aluno;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Nota;
import com.example.mentora.model.Professor; // Importar Professor
import com.example.mentora.model.Turma;     // Importar Turma para validações
import com.example.mentora.model.TurmaDisciplina; // Importar TurmaDisciplina para validações
import com.example.mentora.model.ProfessorDisciplina; // Importar ProfessorDisciplina para validações
import com.example.mentora.repository.AlunoRepository;
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.NotaRepository;
import com.example.mentora.repository.ProfessorRepository; // Importar ProfessorRepository
import com.example.mentora.repository.TurmaDisciplinaRepository; // Importar para validação
import com.example.mentora.repository.ProfessorDisciplinaRepository; // Importar para validação

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotaServiceImpl implements NotaService {

    private static final Logger log = LoggerFactory.getLogger(NotaServiceImpl.class);

    private final NotaRepository notaRepository;
    private final AlunoRepository alunoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final ProfessorRepository professorRepository; // Injetar ProfessorRepository
    private final TurmaDisciplinaRepository turmaDisciplinaRepository; // Para validação
    private final ProfessorDisciplinaRepository professorDisciplinaRepository; // Para validação


    @Autowired
    public NotaServiceImpl(NotaRepository notaRepository,
                           AlunoRepository alunoRepository,
                           DisciplinaRepository disciplinaRepository,
                           ProfessorRepository professorRepository, // Adicionar ao construtor
                           TurmaDisciplinaRepository turmaDisciplinaRepository,
                           ProfessorDisciplinaRepository professorDisciplinaRepository) {
        this.notaRepository = notaRepository;
        this.alunoRepository = alunoRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.professorRepository = professorRepository; // Atribuir
        this.turmaDisciplinaRepository = turmaDisciplinaRepository;
        this.professorDisciplinaRepository = professorDisciplinaRepository;
    }

    @Override
    @Transactional
    public NotaResponseDTO lancarNota(NotaCreateDTO dto) {
        log.info("Tentando lançar nota para aluno ID: {}, disciplina ID: {}, por professor ID: {}",
                dto.getAlunoId(), dto.getDisciplinaId(), dto.getProfessorId());

        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> {
                    log.warn("Aluno com ID {} não encontrado.", dto.getAlunoId());
                    return new RuntimeException("Aluno com ID " + dto.getAlunoId() + " não encontrado.");
                });

        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> {
                    log.warn("Disciplina com ID {} não encontrada.", dto.getDisciplinaId());
                    return new RuntimeException("Disciplina com ID " + dto.getDisciplinaId() + " não encontrada.");
                });

        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> {
                    log.warn("Professor com ID {} não encontrado.", dto.getProfessorId());
                    return new RuntimeException("Professor com ID " + dto.getProfessorId() + " não encontrado.");
                });

        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            log.warn("Tentativa de lançar nota para aluno (ID Usuário: {}) que está inativo ou sem usuário associado.", aluno.getUsuario() != null ? aluno.getUsuario().getId() : "N/A");
            throw new RuntimeException("Não é possível lançar nota para um aluno inativo.");
        }

        if (professor.getUsuario() == null || !professor.getUsuario().getAtivo()) {
            log.warn("Tentativa de lançamento de nota por professor (ID Usuário: {}) que está inativo ou sem usuário associado.", professor.getUsuario() != null ? professor.getUsuario().getId() : "N/A");
            throw new RuntimeException("Professor inativo não pode lançar notas.");
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
            log.warn("Professor ID {} não está autorizado a lançar notas para a disciplina ID {}.",
                    professor.getId(), disciplina.getId());
            throw new RuntimeException("Professor ID " + professor.getId() +
                    " não leciona a disciplina ID " + disciplina.getId() + ".");
        }

        Nota nota = new Nota();
        nota.setAluno(aluno);
        nota.setDisciplina(disciplina);
        nota.setProfessor(professor); // Associar o professor
        nota.setValor(dto.getValor());

        Nota notaSalva = notaRepository.save(nota);
        log.info("Nota ID {} lançada com sucesso para aluno ID {}, disciplina ID {}, por professor ID {}.",
                notaSalva.getId(), aluno.getId(), disciplina.getId(), professor.getId());

        return toResponseDTO(notaSalva);
    }

    @Override
    @Transactional(readOnly = true)
    public NotaResponseDTO buscarNotaPorId(Long id) {
        log.debug("Buscando nota com ID: {}", id);
        Nota nota = notaRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Nota com ID {} não encontrada.", id);
                    return new RuntimeException("Nota com ID " + id + " não encontrada.");
                });
        return toResponseDTO(nota);
    }
    @Override
    public List<NotaResponseDTO> listarTodasNotas() {
        List<Nota> notas = notaRepository.findAll();
        return notas.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotaResponseDTO> listarNotasPorAluno(Long alunoId) {
        log.debug("Listando notas para o aluno ID: {}", alunoId);

        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno com ID " + alunoId + " não encontrado."));
        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            log.warn("Tentativa de listar notas para aluno (ID Usuário: {}) que está inativo ou sem usuário.", aluno.getUsuario() != null ? aluno.getUsuario().getId() : "N/A");
            throw new RuntimeException("Não é possível listar notas de um aluno inativo.");
        }

        List<Nota> notas = notaRepository.findByAlunoId(alunoId);
        return toResponseDTOList(notas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotaResponseDTO> listarNotasPorAlunoEDisciplina(Long alunoId, Long disciplinaId) {
        log.debug("Listando notas para o aluno ID: {} e disciplina ID: {}", alunoId, disciplinaId);
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno com ID " + alunoId + " não encontrado."));
        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            log.warn("Tentativa de listar notas para aluno (ID Usuário: {}) que está inativo ou sem usuário.", aluno.getUsuario() != null ? aluno.getUsuario().getId() : "N/A");
            throw new RuntimeException("Não é possível listar notas de um aluno inativo.");
        }
        if (!disciplinaRepository.existsById(disciplinaId)) {
            throw new RuntimeException("Disciplina com ID " + disciplinaId + " não encontrada.");
        }

        List<Nota> notas = notaRepository.findByAlunoIdAndDisciplinaId(alunoId, disciplinaId);
        return toResponseDTOList(notas);
    }

    private NotaResponseDTO toResponseDTO(Nota nota) {
        Aluno aluno = nota.getAluno();
        Disciplina disciplina = nota.getDisciplina();
        Professor professor = nota.getProfessor();

        String nomeAluno = (aluno != null && aluno.getUsuario() != null) ? aluno.getUsuario().getNome() : "Aluno não disponível";
        String nomeDisciplina = (disciplina != null) ? disciplina.getNome() : "Disciplina não disponível";
        String nomeProfessor = (professor != null && professor.getUsuario() != null) ? professor.getUsuario().getNome() : "Professor não disponível";

        return NotaResponseDTO.builder()
                .id(nota.getId())
                .valor(nota.getValor())
                .dataLancamento(nota.getDataLancamento())
                .alunoId(aluno != null ? aluno.getId() : null)
                .nomeAluno(nomeAluno)
                .disciplinaId(disciplina != null ? disciplina.getId() : null)
                .nomeDisciplina(nomeDisciplina)
                .professorId(professor != null ? professor.getId() : null)
                .nomeProfessor(nomeProfessor)
                .build();
    }

    // Método auxiliar para converter uma lista de entidades Nota para uma lista de NotaResponseDTOs.
    private List<NotaResponseDTO> toResponseDTOList(List<Nota> notas) {
        return notas.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}