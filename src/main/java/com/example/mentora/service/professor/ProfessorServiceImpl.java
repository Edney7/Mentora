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

    // Método auxiliar para mapear Professor para ProfessorResponseDTO
    private ProfessorResponseDTO toProfessorResponseDTO(Professor professor) {
        if (professor == null) {
            return null;
        }
        return ProfessorResponseDTO.builder()
                .id(professor.getId())
                .idUsuario(professor.getUsuario() != null ? professor.getUsuario().getId() : null)
                .nomeUsuario(professor.getUsuario() != null ? professor.getUsuario().getNome() : "N/A")
                // Adicionar outros campos relevantes, como email ou status ativo do usuário, se necessário no DTO
                // .emailUsuario(professor.getUsuario() != null ? professor.getUsuario().getEmail() : "N/A")
                // .ativo(professor.getUsuario() != null ? professor.getUsuario().getAtivo() : false)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> listarProfessoresAtivos() {
        // Utiliza o novo método do repositório que já filtra por usuário ativo
        return professorRepository.findAllWhereUsuarioAtivoTrue()
                .stream()
                .map(this::toProfessorResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarProfessorAtivoPorId(Long id) {
        // Utiliza o novo método do repositório que busca por ID do Professor e verifica se o usuário está ativo
        Professor professor = professorRepository.findByIdAndUsuarioAtivoTrue(id)
                .orElseThrow(() -> new RuntimeException("Perfil de Professor ativo com ID " + id + " não encontrado, ou o usuário associado está inativo."));
        // Considere usar uma exceção mais específica, como ResourceNotFoundException
        return toProfessorResponseDTO(professor);
    }

    // Implementar outros métodos da interface ProfessorService se adicionados
}
