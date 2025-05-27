package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity // Added
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "presenca") // Added
public class Presenca {

    @Id // Added new PK field
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_presenca")
    private Long id;

    @Column(name = "data_aula", nullable = false) // Was: dt_lancamento, renamed to data_aula for clarity
    private LocalDate dataAula; // Field name updated

    @Column(name = "presente", nullable = false) // This field indicates presence status
    private Boolean presente;

    @Column(name = "dt_lancamento", nullable = false)
    private LocalDate dtLancamento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id", referencedColumnName = "id", nullable = false) // Was: idAluno
    private Aluno aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id", nullable = false) // Was: idDisciplina
    private Disciplina disciplina;

    // Consider adding UNIQUE constraint for (aluno_id, disciplina_id, data_aula) using @Table(uniqueConstraints=...)
}