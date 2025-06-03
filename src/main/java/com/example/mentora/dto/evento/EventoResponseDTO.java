package com.example.mentora.dto.evento;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EventoResponseDTO {
    private Long idEvento;
    private String titulo;
    private String descricao;
    private LocalDate data;
    private String tipo;
}