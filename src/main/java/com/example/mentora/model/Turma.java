package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Turma")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_turma")
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String turno;

    @Column(name = "serie_ano")
    private String serieAno;

    @Column(name = "ano_letivo")
    private Integer anoLetivo;
}
