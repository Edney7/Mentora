package com.example.mentora.service.turmadisciplina;

import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.turmadisciplina.AtualizarDisciplinasTurmaRequestDTO;
import com.example.mentora.dto.turmadisciplina.VincularDisciplinaTurmaRequestDTO;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Turma;
import com.example.mentora.model.TurmaDisciplina;
import com.example.mentora.model.TurmaDisciplinaId;
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.TurmaDisciplinaRepository;
import com.example.mentora.repository.TurmaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TurmaDisciplinaServiceImpl implements TurmaDisciplinaService {

    private static final Logger log = LoggerFactory.getLogger(TurmaDisciplinaServiceImpl.class);

    private final TurmaDisciplinaRepository turmaDisciplinaRepository;
    private final TurmaRepository turmaRepository;
    private final DisciplinaRepository disciplinaRepository;

    @Autowired
    public TurmaDisciplinaServiceImpl(TurmaDisciplinaRepository turmaDisciplinaRepository,
                                      TurmaRepository turmaRepository,
                                      DisciplinaRepository disciplinaRepository) {
        this.turmaDisciplinaRepository = turmaDisciplinaRepository;
        this.turmaRepository = turmaRepository;
        this.disciplinaRepository = disciplinaRepository;
    }

    @Override
    @Transactional
    public void vincularDisciplina(VincularDisciplinaTurmaRequestDTO dto) {
        log.info("Tentando vincular disciplina ID {} à turma ID {}", dto.getDisciplinaId(), dto.getTurmaId());
        Turma turma = turmaRepository.findById(dto.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma com ID " + dto.getTurmaId() + " não encontrada."));
        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina com ID " + dto.getDisciplinaId() + " não encontrada."));

        TurmaDisciplinaId turmaDisciplinaId = new TurmaDisciplinaId(turma.getId(), disciplina.getId());
        if (turmaDisciplinaRepository.existsById(turmaDisciplinaId)) {
            log.warn("Disciplina ID {} já está vinculada à Turma ID {}", disciplina.getId(), turma.getId());
            // Considerar lançar uma exceção mais específica ou retornar um status diferente
            throw new RuntimeException("Disciplina ID " + disciplina.getId() + " já está vinculada à Turma ID " + turma.getId());
        }

        TurmaDisciplina turmaDisciplina = new TurmaDisciplina(turma, disciplina);
        turmaDisciplinaRepository.save(turmaDisciplina);
        log.info("Disciplina ID {} vinculada com sucesso à Turma ID {}", disciplina.getId(), turma.getId());
    }

    @Override
    @Transactional
    public void desvincularDisciplina(Long turmaId, Long disciplinaId) {
        log.info("Tentando desvincular disciplina ID {} da turma ID {}", disciplinaId, turmaId);
        TurmaDisciplinaId turmaDisciplinaId = new TurmaDisciplinaId(turmaId, disciplinaId);
        if (!turmaDisciplinaRepository.existsById(turmaDisciplinaId)) {
            log.warn("Vínculo entre Turma ID {} e Disciplina ID {} não encontrado para desvinculação.", turmaId, disciplinaId);
            throw new RuntimeException("Vínculo entre Turma ID " + turmaId + " e Disciplina ID " + disciplinaId + " não encontrado.");
        }
        turmaDisciplinaRepository.deleteById(turmaDisciplinaId);
        log.info("Disciplina ID {} desvinculada com sucesso da Turma ID {}", disciplinaId, turmaId);
    }

    @Override
    @Transactional
    public void atualizarDisciplinasDaTurma(AtualizarDisciplinasTurmaRequestDTO dto) {
        log.info("Atualizando disciplinas para a turma ID {}", dto.getTurmaId());
        Turma turma = turmaRepository.findById(dto.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma com ID " + dto.getTurmaId() + " não encontrada."));

        // Remove todas as associações existentes para esta turma
        log.debug("Removendo associações antigas de disciplinas para a turma ID {}", turma.getId());
        turmaDisciplinaRepository.deleteByTurmaId(turma.getId()); // Usando o método customizado

        // Adiciona as novas associações
        if (dto.getDisciplinaIds() != null && !dto.getDisciplinaIds().isEmpty()) {
            log.debug("Adicionando {} novas associações de disciplinas para a turma ID {}", dto.getDisciplinaIds().size(), turma.getId());
            for (Long disciplinaId : dto.getDisciplinaIds()) {
                Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                        .orElseThrow(() -> {
                            log.error("Disciplina com ID {} não encontrada ao tentar vincular à turma ID {}.", disciplinaId, turma.getId());
                            return new RuntimeException("Disciplina com ID " + disciplinaId + " não encontrada ao tentar vincular à turma.");
                        });

                TurmaDisciplina novaAssociacao = new TurmaDisciplina(turma, disciplina);
                turmaDisciplinaRepository.save(novaAssociacao);
                log.info("Disciplina ID {} vinculada à Turma ID {}", disciplinaId, turma.getId());
            }
        } else {
            log.info("Nenhuma disciplina fornecida para vincular à Turma ID {}. Todas as associações anteriores foram removidas.", turma.getId());
        }
        log.info("Disciplinas atualizadas com sucesso para a Turma ID {}", turma.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisciplinaResponseDTO> listarDisciplinasPorTurma(Long turmaId) {
        log.debug("Listando disciplinas para a turma ID {}", turmaId);
        if (!turmaRepository.existsById(turmaId)) {
            log.warn("Tentativa de listar disciplinas para turma ID {} não encontrada.", turmaId);
            throw new RuntimeException("Turma com ID " + turmaId + " não encontrada.");
        }

        List<TurmaDisciplina> associacoes = turmaDisciplinaRepository.findByTurmaId(turmaId);
        log.debug("Encontradas {} associações de disciplina para a turma ID {}", associacoes.size(), turmaId);

        return associacoes.stream()
                .map(TurmaDisciplina::getDisciplina)
                .map(this::toDisciplinaResponseDTO)
                .collect(Collectors.toList());
    }

    private DisciplinaResponseDTO toDisciplinaResponseDTO(Disciplina disciplina) {
        return DisciplinaResponseDTO.builder()
                .id(disciplina.getId())
                .nome(disciplina.getNome())
                .descricao(disciplina.getDescricao())
                .build();
    }
}
