package com.example.mentora.dto.usuario;

import com.example.mentora.enums.TipoUsuario;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private String sexo;
    private LocalDate dtNascimento;
    private TipoUsuario tipoUsuario;
}
