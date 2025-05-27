package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "professor") // Was: Professor
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Explicitly set for clarity, was defaulting to 'id'
    private Long id;

    @OneToOne(optional = false) // Assuming Professor must have a Usuario profile
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true) // Was: id_usuario, referenced id_usuario
    private Usuario usuario;
}