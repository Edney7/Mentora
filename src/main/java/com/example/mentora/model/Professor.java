package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "professor")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true) // Was: id_usuario, referenced id_usuario
    private Usuario usuario;

    @ManyToMany(mappedBy = "professores")
    private List<Disciplina> disciplinas;


    // NOVO: Adicionar uma lista de associações TurmaDisciplinaProfessor
    // Isso é útil para navegação JPA. MappedBy indica que a relação é bidirecional
    // e o mapeamento é feito pela entidade TurmaDisciplinaProfessor
    @OneToMany(mappedBy = "professor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TurmaDisciplinaProfessor> ofertasDeDisciplinaNaTurma = new ArrayList<>();
    // OU Set<TurmaDisciplinaProfessor> para evitar duplicatas, se aplicável ao seu caso.
}