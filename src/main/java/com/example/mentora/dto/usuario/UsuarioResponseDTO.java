package com.example.mentora.dto.usuario;

import com.example.mentora.enums.TipoUsuario;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter; // Opcional se usar apenas @Builder e @Getter para o DTO

import java.time.LocalDate;

@Getter
@Setter // Adicionado para consistência, ou pode ser removido se não precisar de setters diretos
@Builder
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private String sexo;
    private LocalDate dtNascimento; // Ou dataNascimento se você padronizou os nomes dos campos no DTO
    private TipoUsuario tipoUsuario;
    private Boolean ativo; // GARANTA QUE ESTE CAMPO EXISTE E ESTÁ CORRETO
}
