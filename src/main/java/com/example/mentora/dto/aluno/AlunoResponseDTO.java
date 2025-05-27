package com.example.mentora.dto.aluno;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AlunoResponseDTO {
    private Long id; // ID do perfil Aluno
    private Long usuarioId;
    private String nomeUsuario; // Informação adicional
    private String emailUsuario; // Informação adicional
    private Long turmaId;
    private String nomeTurma; // Informação adicional

    // Adicione outros campos do Aluno ou do Usuário/Turma que sejam úteis na resposta
}
