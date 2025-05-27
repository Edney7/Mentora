package com.example.mentora.service.turma;

import com.example.mentora.dto.turma.TurmaCreateDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.dto.turma.TurmaUpdateDTO;
import com.example.mentora.model.Turma;
import com.example.mentora.repository.TurmaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TurmaServiceImpl implements TurmaService {

    private final TurmaRepository turmaRepository;

    public TurmaServiceImpl(TurmaRepository turmaRepository) {
        this.turmaRepository = turmaRepository;
    }

    @Override
    public TurmaResponseDTO cadastrar(TurmaCreateDTO dto) {
        Turma turma = new Turma();
        turma.setNome(dto.getNome());
        turma.setTurno(dto.getTurno());
        turma.setSerieAno(dto.getSerieAno());
        turma.setAnoLetivo(dto.getAnoLetivo());

        Turma salva = turmaRepository.save(turma);
        return toResponseDTO(salva);
    }

    @Override
    public List<TurmaResponseDTO> listar() {
        return turmaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private TurmaResponseDTO toResponseDTO(Turma turma) {
        return TurmaResponseDTO.builder()
                .id(turma.getId())
                .nome(turma.getNome())
                .turno(turma.getTurno())
                .serieAno(turma.getSerieAno())
                .anoLetivo(turma.getAnoLetivo())
                .build();
    }

    @Override
    public TurmaResponseDTO atualizar(Long id, TurmaUpdateDTO dto) {
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        turma.setNome(dto.getNome());
        turma.setTurno(dto.getTurno());
        turma.setSerieAno(dto.getSerieAno());
        turma.setAnoLetivo(dto.getAnoLetivo());

        Turma atualizada = turmaRepository.save(turma);
        return toResponseDTO(atualizada);
    }
}
