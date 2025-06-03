package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "turma")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 20)
    private String turno;

    @Column(name = "serie_ano", length = 20)
    private String serieAno;

    @Column(name = "ano_letivo")
    private Integer anoLetivo;

    @Column(name = "ativa", nullable = false)
    private Boolean ativa = true;
}