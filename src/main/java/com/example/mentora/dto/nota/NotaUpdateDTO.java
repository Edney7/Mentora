package com.example.mentora.dto.nota;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotaUpdateDTO {

    @NotNull(message = "O valor da nota é obrigatório para atualização.")
    @DecimalMin(value = "0.0", inclusive = true, message = "A nota não pode ser menor que 0.")
    @DecimalMax(value = "100.0", inclusive = true, message = "A nota não pode ser maior que 100.") // Ajuste conforme a sua escala
    private Double valor;

}