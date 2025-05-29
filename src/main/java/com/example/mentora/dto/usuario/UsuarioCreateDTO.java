package com.example.mentora.dto.usuario;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List; // Importar List


@Getter
@Setter
public class UsuarioCreateDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @Email(message = "Email inválido")
    @NotBlank(message = "Email é obrigatório")
    private String email;

    @NotBlank(message = "Sexo é obrigatório")
    private String sexo;

    @NotNull(message = "Data de nascimento é obrigatória")
    @PastOrPresent(message = "Data de nascimento deve ser no passado ou presente")
    private LocalDate dtNascimento; // Manter como dtNascimento se o DTO for usado externamente assim

    @NotBlank(message = "Tipo de usuário é obrigatório")
    private String tipoUsuario;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;

    // Usado para Aluno
    private Long turmaId;

    // Novo campo para IDs das Disciplinas, usado para Professor
    private List<Long> disciplinaIds;
}