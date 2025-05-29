package com.example.mentora.model; // Ou o seu pacote de modelo

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor // JPA requer um construtor sem argumentos
@Entity
@Table(name = "ausencia_professor")
public class AusenciaProfessor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull(message = "A data da ausência é obrigatória.")
    @FutureOrPresent(message = "A data da ausência deve ser no presente ou futuro.") // Validação útil
    @Column(name = "data_ausencia", nullable = false)
    private LocalDate dataAusencia; // Poderia ser dataInicio e dataFim se a ausência puder durar vários dias

    @Column(name = "motivo", columnDefinition = "TEXT")
    private String motivo; // Motivo da ausência (opcional)

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", referencedColumnName = "id", nullable = false)
    private Professor professor;

    @Column(name = "data_registro", nullable = false)
    private LocalDate dataRegistro; // Data em que a ausência foi registrada

    // Opcional: Status da ausência (ex: PENDENTE, APROVADA, REJEITADA)
    // @Enumerated(EnumType.STRING)
    // @Column(name = "status")
    // private StatusAusencia status;

    @PrePersist
    protected void onCreate() {
        if (dataRegistro == null) {
            dataRegistro = LocalDate.now();
        }
        // Se houver status, poderia ser definido como PENDENTE aqui
        // if (status == null) {
        //     status = StatusAusencia.PENDENTE;
        // }
    }

    // Construtor para facilitar a criação (opcional)
    public AusenciaProfessor(LocalDate dataAusencia, String motivo, Professor professor) {
        this.dataAusencia = dataAusencia;
        this.motivo = motivo;
        this.professor = professor;
    }
}
