package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "presenca") // Added
public class Presenca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "data_aula", nullable = false)
    private LocalDate dataAula;

    @Column(name = "presente", nullable = false)
    private Boolean presente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id", referencedColumnName = "id", nullable = false)
    private Aluno aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id", nullable = false)
    private Disciplina disciplina;

}