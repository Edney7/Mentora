package com.example.mentora.dto.evento;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EventoCreateDTO {
    private String titulo;
    private String descricao;
    private LocalDate data;
    private String tipo;
    private Long idSecretaria;
    private Long idCalendario;
}
