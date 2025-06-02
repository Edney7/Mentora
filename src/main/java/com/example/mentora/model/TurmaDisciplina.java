package com.example.mentora.model; // Ou seu pacote de modelo

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "turma_disciplina")
@IdClass(TurmaDisciplinaId.class) // Especifica a classe de ID composta
public class TurmaDisciplina {

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "turma_id", referencedColumnName = "id") // FK para turma.id
    private Turma turma;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id") // FK para disciplina.id
    private Disciplina disciplina;

    // Você pode adicionar outros campos aqui se a relação tiver atributos próprios
    // Ex: @Column(name = "data_associacao") private LocalDate dataAssociacao;

    public TurmaDisciplina() {
    }

    public TurmaDisciplina(Turma turma, Disciplina disciplina) {
        this.turma = turma;
        this.disciplina = disciplina;
    }
}