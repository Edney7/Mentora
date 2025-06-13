package com.example.mentora.model; // Ou o seu pacote de modelo

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull; // Útil para validações a nível de entidade se desejar
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "falta", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"aluno_id", "disciplina_id", "data_falta"}, name = "uk_aluno_disciplina_data_falta")
})
public class Falta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull(message = "A data da falta é obrigatória.")
    @Column(name = "data_falta", nullable = false)
    private LocalDate dataFalta;

    @Column(name = "justificada", nullable = false)
    private Boolean justificada = false;

    @Column(name = "descricao_justificativa", columnDefinition = "TEXT")
    private String descricaoJustificativa;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", referencedColumnName = "id", nullable = false)
    private Aluno aluno;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id", nullable = false)
    private Disciplina disciplina;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", referencedColumnName = "id", nullable = false)
    private Professor professor;


    public Falta(LocalDate dataFalta, Aluno aluno, Disciplina disciplina, Professor professor) {
        this.dataFalta = dataFalta;
        this.aluno = aluno;
        this.disciplina = disciplina;
        this.professor = professor;
        this.justificada = false; // Default
    }

}
