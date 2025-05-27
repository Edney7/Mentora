package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "aluno")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Was: id_aluno
    private Long id;

    @OneToOne(optional = false) // Assuming an Aluno must have a Usuario profile
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true) // Was: id_usuario, referenced id_usuario
    private Usuario usuario;

    @ManyToOne(optional = false) // Assuming an Aluno must belong to a Turma
    @JoinColumn(name = "turma_id", referencedColumnName = "id", nullable = false) // Was: id_turma, referenced id_turma
    private Turma turma;
}