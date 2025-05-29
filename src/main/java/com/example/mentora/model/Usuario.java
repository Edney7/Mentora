package com.example.mentora.model;

import com.example.mentora.enums.TipoUsuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Was: id_usuario
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 15) // Adjusted length based on DDL
    private String sexo;

    @Column(name = "data_nascimento", nullable = false) // Was: dtNascimento, @Column(name = "dtNascimento")
    private LocalDate dataNascimento; // Field name can remain camelCase, DB column is snake_case

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario", nullable = false) // Was: @Column(name = "tipo")
    private TipoUsuario tipoUsuario;

    @JsonIgnore
    @Column(name = "senha_hash", nullable = false) // Was: senha, better reflects it's a hash
    private String senha; // Field name can stay 'senha' or be 'senhaHash'

    @Column(nullable = false)
    private Boolean ativo = true;
}