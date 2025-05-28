package com.example.mentora.dto.ausenciaprofessor; // Crie este pacote se necessário

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
    private Long professorId; // Este ID virá do professor autenticado ou será fornecido pela secretaria

    @NotNull(message = "A data da ausência é obrigatória.")
    @FutureOrPresent(message = "A data da ausência deve ser no presente ou no futuro.")
    private LocalDate dataAusencia;

    @Size(max = 500, message = "O motivo da ausência não pode exceder 500 caracteres.")
    private String motivo; // Motivo é opcional
}