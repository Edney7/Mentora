package com.example.mentora.service.nota;

import com.example.mentora.dto.nota.NotaCreateDTO;
import com.example.mentora.dto.nota.NotaResponseDTO;

import java.util.List;

public interface NotaService {
    NotaResponseDTO cadastrar(NotaCreateDTO dto);
    List<NotaResponseDTO> listar();
}
