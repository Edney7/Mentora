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
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno; // Quem faltou

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aula_id", nullable = false) // CHAVE ESTRANGEIRA PARA A NOVA ENTIDADE AULA
    private Aula aula; // A qual aula específica essa falta se refere

    private Boolean justificada = false; // Se a falta foi justificada ou não (padrão false)

    @Column(nullable = false)
    private LocalDate dataRegistro; // Quando a falta foi registrada no sistema

    // O professor que registrou a falta pode ser o professor da aula ou um coordenador, etc.
    // Se for sempre o professor da aula, você pode derivá-lo de 'aula.getProfessor()'.
    // Se puder ser qualquer professor/admin, mantenha este campo.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_que_registrou_id", nullable = false)
    private Professor professorQueRegistrou; // Quem registrou esta falta no sistema
}
