package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "turma") // Was: Turma
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Was: id_turma
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 20)
    private String turno;

    @Column(name = "serie_ano", length = 20)
    private String serieAno;

    @Column(name = "ano_letivo")
    private Integer anoLetivo;

    @Column(name = "ativa", nullable = false) // Was: ativo, 'ativa' matches common DDL
    private Boolean ativa = true; // Field name updated for consistency

    @OneToMany(mappedBy = "turma")
    private List<Aluno> alunos;

    @ManyToMany
    @JoinTable(
            name = "turma_disciplina",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "disciplina_id")
    )
    private List<Disciplina> disciplinas;

}