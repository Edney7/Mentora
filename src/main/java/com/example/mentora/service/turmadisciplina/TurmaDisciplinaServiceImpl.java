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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TurmaDisciplinaServiceImpl implements TurmaDisciplinaService {

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
        Turma turma = turmaRepository.findById(dto.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma com ID " + dto.getTurmaId() + " não encontrada."));
        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina com ID " + dto.getDisciplinaId() + " não encontrada."));

        TurmaDisciplinaId turmaDisciplinaId = new TurmaDisciplinaId(turma.getId(), disciplina.getId());
        if (turmaDisciplinaRepository.existsById(turmaDisciplinaId)) {
            throw new RuntimeException("Disciplina ID " + disciplina.getId() + " já está vinculada à Turma ID " + turma.getId());
        }

        TurmaDisciplina turmaDisciplina = new TurmaDisciplina(turma, disciplina);
        turmaDisciplinaRepository.save(turmaDisciplina);
    }

    @Override
    @Transactional
    public void desvincularDisciplina(Long turmaId, Long disciplinaId) {
        TurmaDisciplinaId turmaDisciplinaId = new TurmaDisciplinaId(turmaId, disciplinaId);
        if (!turmaDisciplinaRepository.existsById(turmaDisciplinaId)) {
            throw new RuntimeException("Vínculo entre Turma ID " + turmaId + " e Disciplina ID " + disciplinaId + " não encontrado.");
        }
        turmaDisciplinaRepository.deleteById(turmaDisciplinaId);
    }

    @Override
    @Transactional
    public void atualizarDisciplinasDaTurma(AtualizarDisciplinasTurmaRequestDTO dto) {
        Turma turma = turmaRepository.findById(dto.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma com ID " + dto.getTurmaId() + " não encontrada."));

        turmaDisciplinaRepository.deleteByTurmaId(turma.getId());

        if (dto.getDisciplinaIds() != null && !dto.getDisciplinaIds().isEmpty()) {
            for (Long disciplinaId : dto.getDisciplinaIds()) {
                Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                        .orElseThrow(() -> new RuntimeException("Disciplina com ID " + disciplinaId + " não encontrada ao tentar vincular à turma."));

                TurmaDisciplina novaAssociacao = new TurmaDisciplina(turma, disciplina);
                turmaDisciplinaRepository.save(novaAssociacao);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisciplinaResponseDTO> listarDisciplinasPorTurma(Long turmaId) {
        if (!turmaRepository.existsById(turmaId)) {
            throw new RuntimeException("Turma com ID " + turmaId + " não encontrada.");
        }

        List<TurmaDisciplina> associacoes = turmaDisciplinaRepository.findByTurmaId(turmaId);

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
