package com.example.mentora.dto.turma; // Certifique-se que este é o seu pacote correto

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TurmaCreateDTO {

    @NotBlank(message = "Nome da turma é obrigatório")
    private String nome;

    private String turno; // Ex: Manhã, Tarde, Noite

    @NotBlank(message = "Série/Ano da turma é obrigatório")
    private String serieAno; // Ex: "1º Ano", "9ª Série"

    @NotNull(message = "Ano letivo é obrigatório")
    private Integer anoLetivo;

    private Boolean ativa; // Campo adicionado - pode ser nulo se for opcional na criação
    // e o serviço definir um padrão.
}
