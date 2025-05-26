package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "falta")
public class Falta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_falta")
    private Long id;

    @Column(nullable = false)
    private Boolean justificada = false;

    @ManyToOne
    @JoinColumn(name = "idAluno, nullable = false")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "idDisciplina", nullable = false)
    private Disciplina disciplina;
}
