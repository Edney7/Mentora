package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "aluno") // Certifique-se de que o nome da tabela no BD é "aluno"
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true)
    private Usuario usuario; // O status 'ativo' deste aluno será determinado pelo usuario.getAtivo()

    @ManyToOne(optional = false)
    @JoinColumn(name = "turma_id", referencedColumnName = "id", nullable = false)
    private Turma turma;

}
