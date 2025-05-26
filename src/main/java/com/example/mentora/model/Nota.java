package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nota")
    private Long id;

    @Column(nullable = false)
    private Double valor;

    @Column(name = "dt_lancamento")
    private LocalDate dtLancamento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idAluno", nullable = false)
    private Aluno aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idDisciplina", nullable = false)
    private Disciplina disciplina;
}
