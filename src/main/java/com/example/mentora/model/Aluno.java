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
    @Column(name = "id")
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true)
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "turma_id", referencedColumnName = "id", nullable = false)
    private Turma turma;

}
