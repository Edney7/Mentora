package com.example.mentora.service.professordisciplina;

import com.example.mentora.dto.professordisciplina.ProfessorDisciplinaCreateDTO;
import com.example.mentora.dto.professordisciplina.ProfessorDisciplinaResponseDTO;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Professor;
import com.example.mentora.model.ProfessorDisciplina;
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.ProfessorDisciplinaRepository;
import com.example.mentora.repository.ProfessorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorDisciplinaServiceImpl implements ProfessorDisciplinaService {

    private final ProfessorDisciplinaRepository repository;
    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;

    public ProfessorDisciplinaServiceImpl(
            ProfessorDisciplinaRepository repository,
            ProfessorRepository professorRepository,
            DisciplinaRepository disciplinaRepository
    ) {
        this.repository = repository;
        this.professorRepository = professorRepository;
        this.disciplinaRepository = disciplinaRepository;
    }

    @Override
    public ProfessorDisciplinaResponseDTO vincular(ProfessorDisciplinaCreateDTO dto) {
        Professor professor = professorRepository.findById(dto.getIdProfessor())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        Disciplina disciplina = disciplinaRepository.findById(dto.getIdDisciplina())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        ProfessorDisciplina pd = new ProfessorDisciplina();
        pd.setProfessor(professor);
        pd.setDisciplina(disciplina);

        ProfessorDisciplina salvo = repository.save(pd);

        return new ProfessorDisciplinaResponseDTO(
                salvo.getProfessor().getId(),
                salvo.getProfessor().getUsuario().getNome(),
                salvo.getDisciplina().getId(),
                salvo.getDisciplina().getNome()
        );
    }

    @Override
    public List<ProfessorDisciplinaResponseDTO> listarTodos() {
        return repository.findAll().stream().map(pd -> new ProfessorDisciplinaResponseDTO(
                pd.getProfessor().getId(),
                pd.getProfessor().getUsuario().getNome(),
                pd.getDisciplina().getId(),
                pd.getDisciplina().getNome()
        )).collect(Collectors.toList());
    }
}
