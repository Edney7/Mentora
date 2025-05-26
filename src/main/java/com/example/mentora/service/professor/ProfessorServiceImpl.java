package com.example.mentora.service.professor;

import com.example.mentora.dto.professor.ProfessorCreateDTO;
import com.example.mentora.dto.professor.ProfessorResponseDTO;
import com.example.mentora.model.Professor;
import com.example.mentora.model.Usuario;
import com.example.mentora.repository.ProfessorRepository;
import com.example.mentora.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorServiceImpl implements ProfessorService {

    private final ProfessorRepository professorRepository;
    private final UsuarioRepository usuarioRepository;

    public ProfessorServiceImpl(ProfessorRepository professorRepository, UsuarioRepository usuarioRepository) {
        this.professorRepository = professorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public ProfessorResponseDTO cadastrar(ProfessorCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Professor professor = new Professor();
        professor.setUsuario(usuario);

        Professor salvo = professorRepository.save(professor);

        return toResponseDTO(salvo);
    }

    @Override
    public List<ProfessorResponseDTO> listarTodos() {
        return professorRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private ProfessorResponseDTO toResponseDTO(Professor professor) {
        return ProfessorResponseDTO.builder()
                .id(professor.getId())
                .idUsuario(professor.getUsuario().getId())
                .nomeUsuario(professor.getUsuario().getNome())
                .build();
    }
}

