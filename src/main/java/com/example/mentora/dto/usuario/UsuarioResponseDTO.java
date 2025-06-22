package com.example.mentora.dto.usuario;

import com.example.mentora.enums.TipoUsuario;
import lombok.*;

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
    private Boolean ativo;
    private Long professorId;
    private Long secretariaId;
}
