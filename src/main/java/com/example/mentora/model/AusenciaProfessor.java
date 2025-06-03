package com.example.mentora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "ausencia_professor")
public class AusenciaProfessor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull(message = "A data da ausência é obrigatória.")
    @FutureOrPresent(message = "A data da ausência deve ser no presente ou futuro.")
    @Column(name = "data_ausencia", nullable = false)
    private LocalDate dataAusencia;

    @Column(name = "motivo", columnDefinition = "TEXT")
    private String motivo;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", referencedColumnName = "id", nullable = false)
    private Professor professor;

    @Column(name = "data_registro", nullable = false)
    private LocalDate dataRegistro;

    @PrePersist
    protected void onCreate() {
        if (dataRegistro == null) {
            dataRegistro = LocalDate.now();
        }
    }

    public AusenciaProfessor(LocalDate dataAusencia, String motivo, Professor professor) {
        this.dataAusencia = dataAusencia;
        this.motivo = motivo;
        this.professor = professor;
    }
}
