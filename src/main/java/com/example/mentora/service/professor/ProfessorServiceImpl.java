package com.example.mentora.service.professor;

import com.example.mentora.dto.professor.ProfessorResponseDTO;
import com.example.mentora.model.Professor;
import com.example.mentora.repository.ProfessorRepository;
// Considere criar exceções customizadas, ex:
// import com.example.mentora.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorServiceImpl implements ProfessorService {

    private final ProfessorRepository professorRepository;

    public ProfessorServiceImpl(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    private ProfessorResponseDTO toProfessorResponseDTO(Professor professor) {
        if (professor == null) {
            return null;
        }
        return ProfessorResponseDTO.builder()
                .id(professor.getId())
                .idUsuario(professor.getUsuario() != null ? professor.getUsuario().getId() : null)
                .nomeUsuario(professor.getUsuario() != null ? professor.getUsuario().getNome() : "N/A")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> listarProfessoresAtivos() {
        return professorRepository.findAllWhereUsuarioAtivoTrue()
                .stream()
                .map(this::toProfessorResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarProfessorAtivoPorId(Long id) {
        Professor professor = professorRepository.findByIdAndUsuarioAtivoTrue(id)
                .orElseThrow(() -> new RuntimeException("Perfil de Professor ativo com ID " + id + " não encontrado, ou o usuário associado está inativo."));
        return toProfessorResponseDTO(professor);
    }

}
