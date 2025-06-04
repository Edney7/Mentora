package com.example.mentora.controller;

import com.example.mentora.dto.evento.EventoCreateDTO;
import com.example.mentora.dto.evento.EventoResponseDTO;
import com.example.mentora.service.evento.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @PostMapping
    public ResponseEntity<EventoResponseDTO> criarEvento(@RequestBody EventoCreateDTO dto) {
        EventoResponseDTO evento = eventoService.criarEvento(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(evento);
    }

    @GetMapping
    public ResponseEntity<List<EventoResponseDTO>> listarEventos() {
        return ResponseEntity.ok(eventoService.listarEventos());
    }
}