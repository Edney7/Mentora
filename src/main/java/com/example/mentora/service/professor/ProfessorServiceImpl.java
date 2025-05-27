package com.example.mentora.service.professor;

import com.example.mentora.dto.professor.ProfessorResponseDTO;
import com.example.mentora.model.Professor;
import com.example.mentora.repository.ProfessorRepository;
// UsuarioRepository não é mais necessário aqui se o cadastro foi removido
// e o toResponseDTO já acessa o usuário através da entidade Professor.
// import com.example.mentora.repository.UsuarioRepository;

// Considere criar exceções customizadas, ex:
// import com.example.mentora.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorServiceImpl implements ProfessorService {

    private final ProfessorRepository professorRepository;
    // private final UsuarioRepository usuarioRepository; // Removido se não usado diretamente

    public ProfessorServiceImpl(ProfessorRepository professorRepository
            /*, UsuarioRepository usuarioRepository */) {
        this.professorRepository = professorRepository;
        // this.usuarioRepository = usuarioRepository;
    }

    // O método cadastrar(ProfessorCreateDTO dto) foi removido.

    @Override
    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> listarTodos() {
        return professorRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarPorId(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de Professor com ID " + id + " não encontrado.")); // Usar ResourceNotFoundException
        return toResponseDTO(professor);
    }

    private ProfessorResponseDTO toResponseDTO(Professor professor) {
        if (professor == null) {
            return null;
        }
        return ProfessorResponseDTO.builder()
                .id(professor.getId())
                .idUsuario(professor.getUsuario() != null ? professor.getUsuario().getId() : null)
                .nomeUsuario(professor.getUsuario() != null ? professor.getUsuario().getNome() : "N/A")
                // Adicione outros campos conforme o ProfessorResponseDTO for enriquecido
                .build();
    }

    // Implementar outros métodos da interface ProfessorService se adicionados (atualizar, deletar)
}
