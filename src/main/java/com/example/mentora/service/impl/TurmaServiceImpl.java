package com.example.mentora.service.impl;

import com.example.mentora.dto.TurmaCreateDTO;
import com.example.mentora.dto.TurmaResponseDTO;
import com.example.mentora.model.Turma;
import com.example.mentora.repository.TurmaRepository;
import com.example.mentora.service.TurmaService;
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
}
