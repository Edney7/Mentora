package com.example.mentora.model; // Ou o seu pacote de modelo

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull; // Útil para validações a nível de entidade se desejar
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor // JPA requer um construtor sem argumentos
@Entity
@Table(name = "falta", uniqueConstraints = {
        // Garante que um aluno não tenha mais de um registro de falta/presença para a mesma disciplina no mesmo dia.
        // Se você tiver uma tabela separada para Presenca, essa constraint pode ser apenas para Falta.
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
    private Boolean justificada = false; // Por padrão, uma falta não é justificada

    @Column(name = "descricao_justificativa", columnDefinition = "TEXT")
    private String descricaoJustificativa; // Opcional, apenas se justificada = true

    @NotNull // Validação a nível de código, a coluna no BD já é non-null pelo JoinColumn
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", referencedColumnName = "id", nullable = false)
    private Aluno aluno;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id", nullable = false)
    private Disciplina disciplina;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", referencedColumnName = "id", nullable = false) // Professor que registrou a falta
    private Professor professor;

    // Construtor para facilitar a criação (opcional, Lombok pode ajudar)
    public Falta(LocalDate dataFalta, Aluno aluno, Disciplina disciplina, Professor professor) {
        this.dataFalta = dataFalta;
        this.aluno = aluno;
        this.disciplina = disciplina;
        this.professor = professor;
        this.justificada = false; // Default
    }

    // Se precisar de um método para definir a data automaticamente na criação:
    // @PrePersist
    // protected void onCreate() {
    //     if (dataFalta == null) {
    //         dataFalta = LocalDate.now(); // Cuidado: isso definiria a data do registro, não necessariamente a data da falta
    //     }                                // É melhor que dataFalta seja explicitamente fornecida.
    // }
}
