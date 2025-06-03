package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "valor", nullable = false, scale = 2)
    private Double valor;

    @Column(name = "data_lancamento")
    private LocalDate dataLancamento;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", referencedColumnName = "id", nullable = false)
    private Aluno aluno;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id", nullable = false)
    private Disciplina disciplina;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", referencedColumnName = "id", nullable = false)
    private Professor professor;

    @PrePersist
    protected void onCreate() {
        if (dataLancamento == null) {
            dataLancamento = LocalDate.now();
        }
    }

    public Nota(Double valor, Aluno aluno, Disciplina disciplina, Professor professor) {
        this.valor = valor;
        this.aluno = aluno;
        this.disciplina = disciplina;
        this.professor = professor;
    }
}
