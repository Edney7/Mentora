package com.example.mentora.service.evento;


import com.example.mentora.dto.evento.EventoCreateDTO;
import com.example.mentora.dto.evento.EventoResponseDTO;

import java.util.List;

public interface EventoService {
    EventoResponseDTO criarEvento(EventoCreateDTO dto);
    List<EventoResponseDTO> listarEventos();
}
