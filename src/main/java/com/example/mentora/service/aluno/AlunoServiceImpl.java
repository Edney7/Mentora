package com.example.mentora.service.aluno;

import com.example.mentora.dto.aluno.AlunoCreateDTO;
import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.model.Aluno;
import com.example.mentora.model.Turma;
import com.example.mentora.model.Usuario;
import com.example.mentora.repository.AlunoRepository;
import com.example.mentora.repository.TurmaRepository;
import com.example.mentora.repository.UsuarioRepository;
import com.example.mentora.service.aluno.AlunoService;
import org.springframework.stereotype.Service;

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

    @Override
    public AlunoResponseDTO cadastrar(AlunoCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Turma turma = turmaRepository.findById(dto.getIdTurma())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        Aluno aluno = new Aluno();
        aluno.setUsuario(usuario);
        aluno.setTurma(turma);

        Aluno salvo = alunoRepository.save(aluno);

        return AlunoResponseDTO.builder()
                .id(salvo.getId())
                .idUsuario(usuario.getId())
                .idTurma(turma.getId())
                .build();
    }

    @Override
    public List<AlunoResponseDTO> listar() {
        return alunoRepository.findAll()
                .stream()
                .map(a -> AlunoResponseDTO.builder()
                        .id(a.getId())
                        .idUsuario(a.getUsuario().getId())
                        .idTurma(a.getTurma().getId())
                        .build())
                .collect(Collectors.toList());
    }
}
