package com.example.mentora.dto.aluno;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AlunoResponseDTO {
    private Long id;
    private Long usuarioId;
    private String nomeUsuario;
    private String emailUsuario;
    private Long turmaId;
    private String nomeTurma;

}
