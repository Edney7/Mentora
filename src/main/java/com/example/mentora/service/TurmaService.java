package com.example.mentora.service;

import com.example.mentora.dto.TurmaCreateDTO;
import com.example.mentora.dto.TurmaResponseDTO;

import java.util.List;

public interface TurmaService {
    TurmaResponseDTO cadastrar(TurmaCreateDTO dto);
    List<TurmaResponseDTO> listar();
}
