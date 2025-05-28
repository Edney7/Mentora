package com.example.mentora.dto.turma; // Certifique-se que este é o seu pacote correto

import lombok.Getter;
import lombok.Setter;
// Importe as anotações de validação se necessário, por exemplo:
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class TurmaUpdateDTO {

    // Mantenha os outros campos que você já tem para atualização
    // Exemplo:
    // @NotBlank(message = "Nome da turma não pode ser vazio se fornecido para atualização")
    private String nome;

    private String turno;

    // @NotBlank(message = "Série/Ano da turma não pode ser vazio se fornecido para atualização")
    private String serieAno;

    // @NotNull(message = "Ano letivo não pode ser nulo se fornecido para atualização")
    private Integer anoLetivo;

    private Boolean ativa; // Campo adicionado para permitir a atualização do status da turma
}
