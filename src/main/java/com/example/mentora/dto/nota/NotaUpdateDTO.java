package com.example.mentora.dto.nota;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotaUpdateDTO {


    private Long id;

    @NotNull(message = "A nota da Prova 1 é obrigatória.")
    @DecimalMin(value = "0.0", message = "A nota não pode ser menor que 0.")
    @DecimalMax(value = "10.0", message = "A nota não pode ser maior que 10.")
    private Double prova1;

    @NotNull(message = "A nota da Prova 2 é obrigatória.")
    @DecimalMin(value = "0.0", message = "A nota não pode ser menor que 0.")
    @DecimalMax(value = "10.0", message = "A nota não pode ser maior que 10.")
    private Double prova2;

    private Double media;

}