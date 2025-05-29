package com.example.mentora.dto.turma;

import lombok.Getter;
import lombok.Setter;
// Importe anotações de validação se quiser adicionar restrições específicas para atualização
// Ex: @Size, @Min, etc. Não use @NotBlank/@NotNull aqui se os campos forem opcionais.

@Getter
@Setter
public class TurmaUpdateDTO {

    // Campos que podem ser atualizados.
    // Se um campo não for fornecido no JSON, seu valor será null aqui.
    private String nome;
    private String turno;
    private String serieAno;
    private Integer anoLetivo;
    private Boolean ativa; // Permite ativar ou desativar a turma via atualização

    // Construtor padrão
    public TurmaUpdateDTO() {
    }

    // Getters e Setters são gerados pelo Lombok
}
