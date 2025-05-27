package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "disciplina")
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Was: id_disciplina
    private Long id;

    @Column(nullable = false, length = 100, unique = true) // Added unique = true
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;
}