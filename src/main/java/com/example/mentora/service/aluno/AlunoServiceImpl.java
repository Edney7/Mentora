package com.example.mentora.service.aluno;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.model.Aluno;
import com.example.mentora.repository.AlunoRepository;
// Removidas as importações de UsuarioRepository e TurmaRepository se não forem mais usadas aqui
// (a não ser que sejam usadas para enriquecer o DTO na listagem, o que é uma boa prática)
import com.example.mentora.repository.UsuarioRepository; // Manter se for buscar dados do usuário para o DTO
import com.example.mentora.repository.TurmaRepository;   // Manter se for buscar dados da turma para o DTO

// Considere criar exceções customizadas, ex:
// import com.example.mentora.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoServiceImpl implements AlunoService {

    private final AlunoRepository alunoRepository;

    private final UsuarioRepository usuarioRepository;
    private final TurmaRepository turmaRepository;

    public AlunoServiceImpl(AlunoRepository alunoRepository, UsuarioRepository usuarioRepository, TurmaRepository turmaRepository) {
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
        this.turmaRepository = turmaRepository;
    }

    // Método auxiliar para mapear Aluno para AlunoResponseDTO
    private AlunoResponseDTO toAlunoResponseDTO(Aluno aluno) {
        if (aluno == null) {
            return null;
        }
        // Se o DTO for enriquecido:
        return AlunoResponseDTO.builder()
                .id(aluno.getId())
                .usuarioId(aluno.getUsuario() != null ? aluno.getUsuario().getId() : null)
                .nomeUsuario(aluno.getUsuario() != null ? aluno.getUsuario().getNome() : "N/A")
                .emailUsuario(aluno.getUsuario() != null ? aluno.getUsuario().getEmail() : "N/A")
                .turmaId(aluno.getTurma() != null ? aluno.getTurma().getId() : null)
                .nomeTurma(aluno.getTurma() != null ? aluno.getTurma().getNome() : "N/A")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listar() {
        return alunoRepository.findAll()
                .stream()
                .map(this::toAlunoResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de Aluno com ID " + id + " não encontrado.")); // Usar ResourceNotFoundException
        return toAlunoResponseDTO(aluno);
    }

}
