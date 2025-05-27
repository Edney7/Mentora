package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;



@Entity
@Table(name = "presencas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Presenca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_presenca")
    private Long id;

    @Column(name = "data_aula", nullable = false)
    private LocalDate dataAula;

    @Column(name = "presente", nullable = false)
    private Boolean presente;

    @Column(name = "dt_lancamento", nullable = false)
    private LocalDate dtLancamento;

    @ManyToOne
    @JoinColumn(name = "aluno_id", referencedColumnName = "id_presenca", nullable = false)
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id_disciplina", nullable = false)
    private Disciplina disciplina;
}
