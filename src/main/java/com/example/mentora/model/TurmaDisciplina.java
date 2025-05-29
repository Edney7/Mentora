package com.example.mentora.model; // Ou seu pacote de modelo

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "turma_disciplina") // Nome da tabela de junção no banco
@IdClass(TurmaDisciplinaId.class) // Especifica a classe de ID composta
public class TurmaDisciplina {

    @Id
    @ManyToOne(optional = false) // A ligação com Turma é obrigatória
    @JoinColumn(name = "turma_id", referencedColumnName = "id") // Coluna FK 'turma_id' na tabela 'turma_disciplina' referenciando 'id' na tabela 'turma'
    private Turma turma; // O nome deste campo ('turma') deve corresponder ao campo em TurmaDisciplinaId

    @Id
    @ManyToOne(optional = false) // A ligação com Disciplina é obrigatória
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id") // Coluna FK 'disciplina_id' na tabela 'turma_disciplina' referenciando 'id' na tabela 'disciplina'
    private Disciplina disciplina; // O nome deste campo ('disciplina') deve corresponder ao campo em TurmaDisciplinaId

    // Construtor padrão é necessário para JPA
    public TurmaDisciplina() {
    }

    // Construtor para facilitar a criação
    public TurmaDisciplina(Turma turma, Disciplina disciplina) {
        this.turma = turma;
        this.disciplina = disciplina;
    }

    // Se a relação Turma-Disciplina tiver atributos próprios (ex: data_vinculo),
    // eles seriam adicionados aqui como colunas normais.
    // Exemplo:
    // @Column(name = "data_vinculo")
    // private LocalDate dataVinculo;
}
