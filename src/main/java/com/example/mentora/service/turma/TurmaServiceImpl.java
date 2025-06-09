package com.example.mentora.service.turma;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.professor.ProfessorResponseDTO;
import com.example.mentora.dto.turma.TurmaCreateDTO;
import com.example.mentora.dto.turma.TurmaDetalhadaDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.dto.turma.TurmaUpdateDTO;
import com.example.mentora.model.Professor;
import com.example.mentora.model.Turma;
import com.example.mentora.repository.TurmaRepository;
// Importar AlunoRepository se for verificar alunos vinculados antes de desativar
// import com.example.mentora.repository.AlunoRepository;
// Importar TurmaDisciplinaRepository se for desvincular disciplinas ao desativar turma
// import com.example.mentora.repository.TurmaDisciplinaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TurmaServiceImpl implements TurmaService {

    private static final Logger log = LoggerFactory.getLogger(TurmaServiceImpl.class);

    private final TurmaRepository turmaRepository;
    // private final AlunoRepository alunoRepository;
    // private final TurmaDisciplinaRepository turmaDisciplinaRepository;

    @Autowired
    public TurmaServiceImpl(TurmaRepository turmaRepository
            /*, AlunoRepository alunoRepository, TurmaDisciplinaRepository turmaDisciplinaRepository */) {
        this.turmaRepository = turmaRepository;
        // this.alunoRepository = alunoRepository;
        // this.turmaDisciplinaRepository = turmaDisciplinaRepository;
    }

    private TurmaResponseDTO toTurmaResponseDTO(Turma turma) {
        if (turma == null) {
            return null;
        }
        return TurmaResponseDTO.builder()
                .id(turma.getId())
                .nome(turma.getNome())
                .turno(turma.getTurno())
                .serieAno(turma.getSerieAno())
                .anoLetivo(turma.getAnoLetivo())
                .ativa(turma.getAtiva())
                .build();
    }

    @Override
    @Transactional
    public TurmaResponseDTO cadastrar(TurmaCreateDTO dto) {
        log.info("Cadastrando nova turma: {}", dto.getNome());
        Turma turma = new Turma();
        turma.setNome(dto.getNome());
        turma.setTurno(dto.getTurno());
        turma.setSerieAno(dto.getSerieAno());
        turma.setAnoLetivo(dto.getAnoLetivo());
        turma.setAtiva(dto.getAtiva() != null ? dto.getAtiva() : true);

        Turma turmaSalva = turmaRepository.save(turma);
        log.info("Turma cadastrada com ID: {}", turmaSalva.getId());
        return toTurmaResponseDTO(turmaSalva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> listarTurmasAtivas() {
        log.info("Listando todas as turmas ativas");
        return turmaRepository.findAllByAtivaTrue().stream()
                .map(this::toTurmaResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TurmaResponseDTO buscarTurmaAtivaPorId(Long id) {
        log.info("Buscando turma ativa com ID: {}", id);
        Turma turma = turmaRepository.findByIdAndAtivaTrue(id)
                .orElseThrow(() -> {
                    log.warn("Turma ativa com ID: {} não encontrada.", id);
                    // Considere usar uma exceção customizada como ResourceNotFoundException
                    return new RuntimeException("Turma ativa com ID " + id + " não encontrada.");
                });
        return toTurmaResponseDTO(turma);
    }

    @Override
    @Transactional
    public TurmaResponseDTO atualizar(Long id, TurmaUpdateDTO dto) {
        log.info("Atualizando turma com ID: {}", id);
        // Busca a turma pelo ID, independentemente do status 'ativa',
        // pois podemos querer atualizar uma turma inativa (ex: reativá-la ou corrigir dados).
        Turma turmaExistente = turmaRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Turma com ID: {} não encontrada para atualização.", id);
                    // Considere usar uma exceção customizada como ResourceNotFoundException
                    return new RuntimeException("Turma com ID " + id + " não encontrada para atualização.");
                });

        boolean modificado = false;

        // Atualiza apenas os campos que foram fornecidos no DTO (não são nulos)
        if (dto.getNome() != null && !dto.getNome().isBlank() && !dto.getNome().equals(turmaExistente.getNome())) {
            turmaExistente.setNome(dto.getNome());
            modificado = true;
        }
        if (dto.getTurno() != null && !dto.getTurno().equals(turmaExistente.getTurno())) {
            turmaExistente.setTurno(dto.getTurno());
            modificado = true;
        }
        if (dto.getSerieAno() != null && !dto.getSerieAno().equals(turmaExistente.getSerieAno())) {
            turmaExistente.setSerieAno(dto.getSerieAno());
            modificado = true;
        }
        if (dto.getAnoLetivo() != null && !dto.getAnoLetivo().equals(turmaExistente.getAnoLetivo())) {
            turmaExistente.setAnoLetivo(dto.getAnoLetivo());
            modificado = true;
        }
        if (dto.getAtiva() != null && !dto.getAtiva().equals(turmaExistente.getAtiva())) {
            turmaExistente.setAtiva(dto.getAtiva());
            modificado = true;
        }

        if (modificado) {
            Turma turmaAtualizada = turmaRepository.save(turmaExistente);
            log.info("Turma com ID: {} atualizada com sucesso.", turmaAtualizada.getId());
            return toTurmaResponseDTO(turmaAtualizada);
        } else {
            log.info("Nenhuma alteração detectada para a turma com ID: {}. Retornando dados existentes.", id);
            return toTurmaResponseDTO(turmaExistente); // Retorna os dados existentes se nada mudou
        }
    }

    @Override
    @Transactional
    public void desativarTurma(Long id) {
        log.info("Tentando desativar turma com ID: {}", id);
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Turma com ID: {} não encontrada para desativação.", id);
                    return new RuntimeException("Turma com ID " + id + " não encontrada para desativação.");
                });

        if (!turma.getAtiva()) {
            log.warn("Tentativa de desativar Turma ID {}, que já está inativa.", id);
            return;
        }
        turma.setAtiva(false);
        turmaRepository.save(turma);
        log.info("Turma ID {} marcada como inativa.", id);
    }

    @Override
    @Transactional
    public void reativarTurma(Long id) {
        log.info("Tentando reativar turma com ID: {}", id);
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Turma com ID: {} não encontrada para reativação.", id);
                    return new RuntimeException("Turma com ID " + id + " não encontrada para reativação.");
                });

        if (turma.getAtiva()) {
            log.warn("Tentativa de reativar Turma ID {}, que já está ativa.", id);
            return;
        }
        turma.setAtiva(true);
        turmaRepository.save(turma);
        log.info("Turma ID {} reativada.", id);
    }
    @Override
    public TurmaDetalhadaDTO buscarDetalhesDaTurma(Long id) {
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        // Alunos
        List<AlunoResponseDTO> alunos = turma.getAlunos().stream()
                .map(aluno -> AlunoResponseDTO.builder()
                        .id(aluno.getId())
                        .usuarioId(aluno.getUsuario().getId())
                        .nomeUsuario(aluno.getUsuario().getNome())
                        .emailUsuario(aluno.getUsuario().getEmail())
                        .turmaId(turma.getId())
                        .nomeTurma(turma.getNome())
                        .build())
                .toList();

        // Professores (a partir das disciplinas vinculadas)
        Set<Professor> professoresSet = turma.getDisciplinas().stream()
                .flatMap(d -> d.getProfessores().stream())
                .collect(Collectors.toSet());

        List<ProfessorResponseDTO> professores = professoresSet.stream()
                .map(prof -> ProfessorResponseDTO.builder()
                        .id(prof.getId())
                        .idUsuario(prof.getUsuario().getId())
                        .nomeUsuario(prof.getUsuario().getNome())

                        .build())
                .toList();

        // Disciplinas
        List<DisciplinaResponseDTO> disciplinas = turma.getDisciplinas().stream()
                .map(d -> DisciplinaResponseDTO.builder()
                        .id(d.getId())
                        .nome(d.getNome())
                        .descricao(d.getDescricao())
                        .build())
                .toList();

        return TurmaDetalhadaDTO.builder()
                .id(turma.getId())
                .nome(turma.getNome())
                .turno(turma.getTurno())
                .serieAno(turma.getSerieAno())
                .anoLetivo(turma.getAnoLetivo())
                .alunos(alunos)
                .professores(professores)
                .disciplinas(disciplinas)
                .build();
    }

}
