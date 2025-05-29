package com.example.mentora.dto.falta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaltaJustificativaDTO {

    @NotBlank(message = "A descrição da justificativa é obrigatória.")
    @Size(min = 5, max = 500, message = "A descrição da justificativa deve ter entre 5 e 500 caracteres.")
    private String descricaoJustificativa;
}