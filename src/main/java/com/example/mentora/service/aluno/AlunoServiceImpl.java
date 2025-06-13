package com.example.mentora.service.aluno;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.model.Aluno;
import com.example.mentora.repository.AlunoRepository;
import com.example.mentora.repository.TurmaRepository; // Importar para verificar se a turma existe
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoServiceImpl implements AlunoService {

    private static final Logger log = LoggerFactory.getLogger(AlunoServiceImpl.class);

    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;

    public AlunoServiceImpl(AlunoRepository alunoRepository, TurmaRepository turmaRepository) {
        this.alunoRepository = alunoRepository;
        this.turmaRepository = turmaRepository;
    }

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
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listarAtivos() {
        log.debug("Listando todos os alunos com usuários ativos.");
        return alunoRepository.findAllWhereUsuarioAtivoTrue()
                .stream()
                .map(this::toAlunoResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AlunoResponseDTO buscarAtivoPorId(Long id) {
        log.debug("Buscando aluno ativo com ID do perfil Aluno: {}", id);
        Aluno aluno = alunoRepository.findByIdAndUsuarioAtivoTrue(id)
                .orElseThrow(() -> {
                    log.warn("Perfil de Aluno ativo com ID {} não encontrado.", id);
                    return new RuntimeException("Perfil de Aluno ativo com ID " + id + " não encontrado, ou o usuário associado está inativo.");
                });
        return toAlunoResponseDTO(aluno);
    }


    @Override
    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listarAlunosPorTurma(Long turmaId) {
        log.debug("Listando alunos para a turma ID: {}", turmaId);

        if (!turmaRepository.existsByIdAndAtivaTrue(turmaId)) {
            log.warn("Tentativa de listar alunos de uma turma ID {} inexistente ou inativa.", turmaId);
            throw new RuntimeException("Turma com ID " + turmaId + " não encontrada ou está inativa.");
        }

        List<Aluno> alunosDaTurma = alunoRepository.findByTurmaIdAndUsuarioAtivoTrue(turmaId);
        log.info("Encontrados {} alunos ativos para a turma ID: {}", alunosDaTurma.size(), turmaId);

        return alunosDaTurma.stream()
                .map(this::toAlunoResponseDTO)
                .collect(Collectors.toList());
    }
}
