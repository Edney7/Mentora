package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "falta", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"aluno_id","disciplina_id", "data_falta"})
})
public class Falta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Was: id_falta
    private Long id;

    @Column(name = "data_falta", nullable = false) // Added field
    private LocalDate dataFalta;

    @Column(nullable = false)
    private Boolean justificada = false;

    @Column(name = "descricao_justificativa", columnDefinition = "TEXT") // Added field
    private String descricaoJustificativa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id", referencedColumnName = "id", nullable = false) // Was: idAluno, syntax error
    private Aluno aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id", nullable = false) // Was: idDisciplina
    private Disciplina disciplina;

    // Consider adding UNIQUE constraint for (aluno_id, disciplina_id, data_falta) using @Table(uniqueConstraints=...)
}