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
    @Column(name = "id") // Was: id_nota
    private Long id;

    @Column(nullable = false) // Consider @Digits or Bean Validation for precision/range
    private Double valor;

    @Column(name = "data_lancamento") // Was: dt_lancamento
    private LocalDate dataLancamento; // Field name updated for consistency

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id", referencedColumnName = "id", nullable = false) // Was: idAluno
    private Aluno aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id", nullable = false) // Was: idDisciplina
    private Disciplina disciplina;
}