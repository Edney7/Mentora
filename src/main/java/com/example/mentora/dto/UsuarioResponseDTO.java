package com.example.mentora.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private String sexo;
    private LocalDate dtNascimento;
    private String tipoUsuario;
}
