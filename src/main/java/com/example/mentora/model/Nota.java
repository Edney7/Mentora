package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor // JPA requer um construtor sem argumentos
@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "valor", nullable = false, scale = 2) // Ex: DECIMAL(5,2) no banco
    private Double valor;

    @Column(name = "data_lancamento")
    private LocalDate dataLancamento;

    @ManyToOne(optional = false, fetch = FetchType.LAZY) // Uma nota sempre pertence a um aluno
    @JoinColumn(name = "aluno_id", referencedColumnName = "id", nullable = false)
    private Aluno aluno;

    @ManyToOne(optional = false, fetch = FetchType.LAZY) // Uma nota sempre pertence a uma disciplina
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id", nullable = false)
    private Disciplina disciplina;

    @ManyToOne(optional = false, fetch = FetchType.LAZY) // Uma nota é lançada por um professor
    @JoinColumn(name = "professor_id", referencedColumnName = "id", nullable = false)
    private Professor professor; // Novo campo para referenciar o professor

    /**
     * Define a data de lançamento automaticamente antes de persistir a entidade pela primeira vez.
     * Também pode ser usado para definir a data de atualização se houver um campo para isso.
     */
    @PrePersist
    protected void onCreate() {
        if (dataLancamento == null) {
            dataLancamento = LocalDate.now();
        }
    }

    // Construtor opcional para facilitar a criação
    public Nota(Double valor, Aluno aluno, Disciplina disciplina, Professor professor) {
        this.valor = valor;
        this.aluno = aluno;
        this.disciplina = disciplina;
        this.professor = professor;
    }
}
