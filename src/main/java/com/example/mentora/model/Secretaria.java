package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "secretaria")
public class Secretaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Was: id_secretaria
    private Long id;

    @OneToOne(optional = false) // Assuming Secretaria staff must have a Usuario profile
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true) // Was: id_usuario, referenced id_usuario
    private Usuario usuario;
}