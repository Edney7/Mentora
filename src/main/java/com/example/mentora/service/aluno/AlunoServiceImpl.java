package com.example.mentora.service.aluno;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.model.Aluno;
import com.example.mentora.repository.AlunoRepository;
// Considere criar exceções customizadas, ex:
// import com.example.mentora.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoServiceImpl implements AlunoService {

    private final AlunoRepository alunoRepository;

    public AlunoServiceImpl(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    // Método auxiliar para mapear Aluno para AlunoResponseDTO
    private AlunoResponseDTO toAlunoResponseDTO(Aluno aluno) {
        if (aluno == null) {
            return null;
        }
        return AlunoResponseDTO.builder()
                .id(aluno.getId())
                .usuarioId(aluno.getUsuario() != null ? aluno.getUsuario().getId() : null)
                .nomeUsuario(aluno.getUsuario() != null ? aluno.getUsuario().getNome() : "N/A")
                .emailUsuario(aluno.getUsuario() != null ? aluno.getUsuario().getEmail() : "N/A")
                .turmaId(aluno.getTurma() != null ? aluno.getTurma().getId() : null)
                .nomeTurma(aluno.getTurma() != null ? aluno.getTurma().getNome() : "N/A")
                // Você pode adicionar o status 'ativo' do usuário ao DTO do Aluno se for útil
                // .ativo(aluno.getUsuario() != null ? aluno.getUsuario().getAtivo() : false)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listarAtivos() {
        // Utiliza o novo método do repositório que já filtra por usuário ativo
        return alunoRepository.findAllWhereUsuarioAtivoTrue()
                .stream()
                .map(this::toAlunoResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AlunoResponseDTO buscarAtivoPorId(Long id) {
        // Utiliza o novo método do repositório que busca por ID do Aluno e verifica se o usuário está ativo
        Aluno aluno = alunoRepository.findByIdAndUsuarioAtivoTrue(id)
                .orElseThrow(() -> new RuntimeException("Perfil de Aluno ativo com ID " + id + " não encontrado, ou o usuário associado está inativo."));
        // Considere usar uma exceção mais específica, como ResourceNotFoundException
        return toAlunoResponseDTO(aluno);
    }
}
