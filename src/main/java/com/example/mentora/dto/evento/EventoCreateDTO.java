package com.example.mentora.dto.evento;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
public class EventoCreateDTO {
    private String titulo;
    private String descricao;

    @JsonFormat( pattern = "yyyy-MM-dd")
    private LocalDate data;

    private String tipo;
    private Long idSecretaria;
    private Long idCalendario;
}
