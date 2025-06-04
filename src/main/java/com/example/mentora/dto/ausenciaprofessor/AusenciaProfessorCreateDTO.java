package com.example.mentora.dto.ausenciaprofessor;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class AusenciaProfessorCreateDTO {

    @NotNull(message = "O ID do Professor é obrigatório.")
    private Long professorId;

    @NotNull(message = "A data da ausência é obrigatória.")
    @FutureOrPresent(message = "A data da ausência deve ser no presente ou no futuro.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy", locale = "pt-BR", timezone = "America/Sao_Paulo")
    private LocalDate dataAusencia; // Para entrada: aceita "dd-MM-yyyy"

    @Size(max = 500, message = "O motivo da ausência não pode exceder 500 caracteres.")
    private String motivo;
}