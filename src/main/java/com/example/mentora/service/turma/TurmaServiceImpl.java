package com.example.mentora.service.turma;

import com.example.mentora.dto.turma.TurmaCreateDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.dto.turma.TurmaUpdateDTO;
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
import java.util.stream.Collectors;

@Service
public class TurmaServiceImpl implements TurmaService {

    private static final Logger log = LoggerFactory.getLogger(TurmaServiceImpl.class);

    private final TurmaRepository turmaRepository;
    // private final AlunoRepository alunoRepository; // Descomente se necessário
    // private final TurmaDisciplinaRepository turmaDisciplinaRepository; // Descomente se necessário

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
        // Novas turmas são ativas por padrão (definido na entidade ou aqui se o DTO permitir)
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
                    return new RuntimeException("Turma ativa com ID " + id + " não encontrada.");
                });
        return toTurmaResponseDTO(turma);
    }

    @Override
    @Transactional
    public TurmaResponseDTO atualizar(Long id, TurmaUpdateDTO dto) {
        log.info("Atualizando turma com ID: {}", id);
        Turma turmaExistente = turmaRepository.findById(id) // Busca mesmo que inativa para permitir atualização do status 'ativa'
                .orElseThrow(() -> {
                    log.warn("Turma com ID: {} não encontrada para atualização.", id);
                    return new RuntimeException("Turma com ID " + id + " não encontrada para atualização.");
                });

        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            turmaExistente.setNome(dto.getNome());
        }
        if (dto.getTurno() != null) {
            turmaExistente.setTurno(dto.getTurno());
        }
        if (dto.getSerieAno() != null) {
            turmaExistente.setSerieAno(dto.getSerieAno());
        }
        if (dto.getAnoLetivo() != null) {
            turmaExistente.setAnoLetivo(dto.getAnoLetivo());
        }
        if (dto.getAtiva() != null) { // Permite atualizar o status 'ativa'
            turmaExistente.setAtiva(dto.getAtiva());
        }

        Turma turmaAtualizada = turmaRepository.save(turmaExistente);
        log.info("Turma com ID: {} atualizada com sucesso.", turmaAtualizada.getId());
        return toTurmaResponseDTO(turmaAtualizada);
    }

    @Override
    @Transactional
    public void desativarTurma(Long id) {
        log.info("Tentando desativar turma com ID: {}", id);
        Turma turma = turmaRepository.findById(id) // Busca mesmo que já inativa
                .orElseThrow(() -> {
                    log.warn("Turma com ID: {} não encontrada para desativação.", id);
                    return new RuntimeException("Turma com ID " + id + " não encontrada para desativação.");
                });

        if (!turma.getAtiva()) {
            log.warn("Tentativa de desativar Turma ID {}, que já está inativa.", id);
            // throw new BusinessRuleException("Turma com ID " + id + " já está inativa.");
            return; // Ou não fazer nada
        }

        // Lógica de Negócio Adicional antes de desativar:
        // 1. Verificar se há alunos ativos vinculados a esta turma.
        //    Se sim, impedir a desativação ou mover os alunos para outra turma.
        //    Ex: if (alunoRepository.countByTurmaIdAndAtivoTrue(id) > 0) { // Requer método customizado
        //            throw new RuntimeException("Não é possível desativar turma com alunos ativos vinculados.");
        //        }
        // 2. Desvincular disciplinas (TurmaDisciplina)? Ou isso acontece automaticamente
        //    se a turma for considerada "inutilizável"?
        //    Ex: turmaDisciplinaRepository.deleteByTurmaId(id);

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
            // throw new BusinessRuleException("Turma com ID " + id + " já está ativa.");
            return; // Ou não fazer nada
        }
        turma.setAtiva(true);
        turmaRepository.save(turma);
        log.info("Turma ID {} reativada.", id);
    }
}
