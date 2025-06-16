package com.example.mentora.service.nota;

import com.example.mentora.dto.nota.AlunoNotasResumoDTO;
import com.example.mentora.dto.nota.AlunoNotasResumoDTO.MediaPorDisciplinaDTO;
import com.example.mentora.dto.nota.NotaCreateDTO;
import com.example.mentora.dto.nota.NotaResponseDTO;
import com.example.mentora.dto.nota.NotaUpdateDTO;
import com.example.mentora.model.Aluno;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Nota;
import com.example.mentora.model.Professor;
import com.example.mentora.model.Turma;
import com.example.mentora.model.TurmaDisciplina;
import com.example.mentora.model.ProfessorDisciplina;
import com.example.mentora.repository.AlunoRepository;
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.NotaRepository;
import com.example.mentora.repository.ProfessorRepository;
import com.example.mentora.repository.TurmaDisciplinaRepository;
import com.example.mentora.repository.ProfessorDisciplinaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NotaServiceImpl implements NotaService {

    private static final Logger log = LoggerFactory.getLogger(NotaServiceImpl.class);

    private final NotaRepository notaRepository;
    private final AlunoRepository alunoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final ProfessorRepository professorRepository;
    private final TurmaDisciplinaRepository turmaDisciplinaRepository;
    private final ProfessorDisciplinaRepository professorDisciplinaRepository;

    @Autowired
    public NotaServiceImpl(NotaRepository notaRepository,
                           AlunoRepository alunoRepository,
                           DisciplinaRepository disciplinaRepository,
                           ProfessorRepository professorRepository,
                           TurmaDisciplinaRepository turmaDisciplinaRepository,
                           ProfessorDisciplinaRepository professorDisciplinaRepository) {
        this.notaRepository = notaRepository;
        this.alunoRepository = alunoRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.professorRepository = professorRepository;
        this.turmaDisciplinaRepository = turmaDisciplinaRepository;
        this.professorDisciplinaRepository = professorDisciplinaRepository;
    }

    @Override
    @Transactional
    public NotaResponseDTO lancarNota(NotaCreateDTO dto) {
        log.info("Tentando lançar nota para aluno ID: {}, disciplina ID: {}, por professor ID: {}",
                dto.getAlunoId(), dto.getDisciplinaId(), dto.getProfessorId());

        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno com ID " + dto.getAlunoId() + " não encontrado."));

        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina com ID " + dto.getDisciplinaId() + " não encontrada."));

        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor com ID " + dto.getProfessorId() + " não encontrado."));

        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            throw new RuntimeException("Não é possível lançar nota para um aluno inativo.");
        }

        if (professor.getUsuario() == null || !professor.getUsuario().getAtivo()) {
            throw new RuntimeException("Professor inativo não pode lançar notas.");
        }

        Turma turmaDoAluno = aluno.getTurma();
        if (turmaDoAluno == null) {
            throw new RuntimeException("Aluno ID " + aluno.getId() + " não está associado a nenhuma turma.");
        }

        boolean disciplinaNaTurma = turmaDisciplinaRepository.findByTurmaId(turmaDoAluno.getId())
                .stream()
                .anyMatch(td -> td.getDisciplina().getId().equals(disciplina.getId()));
        if (!disciplinaNaTurma) {
            throw new RuntimeException("Disciplina ID " + disciplina.getId() +
                    " não pertence à turma do aluno ID " + aluno.getId() + ".");
        }

        boolean professorLecionaDisciplina = professorDisciplinaRepository.findByProfessorId(professor.getId())
                .stream()
                .anyMatch(pd -> pd.getDisciplina().getId().equals(disciplina.getId()));
        if (!professorLecionaDisciplina) {
            throw new RuntimeException("Professor ID " + professor.getId() +
                    " não leciona a disciplina ID " + disciplina.getId() + ".");
        }

        Nota nota = new Nota();
        nota.setAluno(aluno);
        nota.setDisciplina(disciplina);
        nota.setProfessor(professor);
        nota.setBimestre(dto.getBimestre());
        nota.setProva1(dto.getProva1());
        nota.setProva2(dto.getProva2());
        nota.setMedia((dto.getProva1() + dto.getProva2()) / 2);

        Nota notaSalva = notaRepository.save(nota);
        log.info("Nota ID {} lançada com sucesso para aluno ID {}, disciplina ID {}, por professor ID {}.",
                notaSalva.getId(), aluno.getId(), disciplina.getId(), professor.getId());

        return toResponseDTO(notaSalva);
    }

    @Override
    @Transactional(readOnly = true)
    public NotaResponseDTO buscarNotaPorId(Long id) {
        Nota nota = notaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota com ID " + id + " não encontrada."));
        return toResponseDTO(nota);
    }

    @Override
    public List<NotaResponseDTO> listarTodasNotas() {
        List<Nota> notas = notaRepository.findAll();
        return notas.stream().map(this::toResponseDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotaResponseDTO> listarNotasPorAluno(Long alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno com ID " + alunoId + " não encontrado.!!!!"));
        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            throw new RuntimeException("Não é possível listar notas de um aluno inativo.");
        }
        List<Nota> notas = notaRepository.findByAlunoId(alunoId);
        return toResponseDTOList(notas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotaResponseDTO> listarNotasPorAlunoEDisciplina(Long alunoId, Long disciplinaId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno com ID " + alunoId + " não encontrado."));
        if (aluno.getUsuario() == null || !aluno.getUsuario().getAtivo()) {
            throw new RuntimeException("Não é possível listar notas de um aluno inativo.");
        }
        if (!disciplinaRepository.existsById(disciplinaId)) {
            throw new RuntimeException("Disciplina com ID " + disciplinaId + " não encontrada.");
        }
        List<Nota> notas = notaRepository.findByAlunoIdAndDisciplinaId(alunoId, disciplinaId);
        return toResponseDTOList(notas);
    }

    @Override
    @Transactional(readOnly = true)
    public AlunoNotasResumoDTO buscarResumoNotas(Long alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno com ID " + alunoId + " não encontrado."));

        List<Nota> notas = notaRepository.findByAlunoId(alunoId);

        Map<Long, List<Nota>> notasPorDisciplina = notas.stream()
                .filter(n -> n.getDisciplina() != null)
                .collect(Collectors.groupingBy(n -> n.getDisciplina().getId()));

        List<MediaPorDisciplinaDTO> mediasPorDisciplina = new ArrayList<>();

        for (Map.Entry<Long, List<Nota>> entry : notasPorDisciplina.entrySet()) {
            Long disciplinaId = entry.getKey();
            List<Nota> notasDisciplina = entry.getValue();

            double mediaFinal = notasDisciplina.stream()
                    .filter(n -> n.getMedia() != null)
                    .mapToDouble(Nota::getMedia)
                    .average()
                    .orElse(0);

            String nomeDisciplina = notasDisciplina.get(0).getDisciplina().getNome();

            mediasPorDisciplina.add(new MediaPorDisciplinaDTO(disciplinaId, nomeDisciplina, mediaFinal));
        }

        AlunoNotasResumoDTO resumo = new AlunoNotasResumoDTO();
        resumo.setAlunoId(aluno.getId());
        resumo.setNomeAluno(aluno.getUsuario().getNome());
        resumo.setMediasPorDisciplina(mediasPorDisciplina);
        resumo.setTotalFaltas(0);
        resumo.setTotalAulas(0);
        resumo.setAulasAssistidas(0);
        resumo.setFaltasPorDisciplina(Collections.emptyList());

        return resumo;
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
                .dataLancamento(nota.getDataLancamento())
                .alunoId(aluno != null ? aluno.getId() : null)
                .nomeAluno(nomeAluno)
                .disciplinaId(disciplina != null ? disciplina.getId() : null)
                .nomeDisciplina(nomeDisciplina)
                .professorId(professor != null ? professor.getId() : null)
                .nomeProfessor(nomeProfessor)
                .build();
    }

    private List<NotaResponseDTO> toResponseDTOList(List<Nota> notas) {
        return notas.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }
}
