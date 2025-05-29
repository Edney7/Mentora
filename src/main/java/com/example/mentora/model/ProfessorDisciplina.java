package com.example.mentora.model; // Ou seu pacote de modelo

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "professor_disciplina") // Nome da tabela de junção no banco
@IdClass(ProfessorDisciplinaId.class) // Especifica a classe de ID composta
public class ProfessorDisciplina {

    @Id
    @ManyToOne(optional = false) // A ligação com Professor é obrigatória
    // A coluna FK 'professor_id' na tabela 'professor_disciplina' referencia 'id' na tabela 'professor'
    @JoinColumn(name = "professor_id", referencedColumnName = "id")
    private Professor professor; // O nome deste campo ('professor') deve corresponder ao campo em ProfessorDisciplinaId

    @Id
    @ManyToOne(optional = false) // A ligação com Disciplina é obrigatória
    // A coluna FK 'disciplina_id' na tabela 'professor_disciplina' referencia 'id' na tabela 'disciplina'
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id")
    private Disciplina disciplina; // O nome deste campo ('disciplina') deve corresponder ao campo em ProfessorDisciplinaId

    // Construtor padrão é necessário para JPA
    public ProfessorDisciplina() {
    }

    // Construtor para facilitar a criação
    public ProfessorDisciplina(Professor professor, Disciplina disciplina) {
        this.professor = professor;
        this.disciplina = disciplina;
    }

    // Se a relação Professor-Disciplina tiver atributos próprios (ex: data_atribuicao),
    // eles seriam adicionados aqui como colunas normais.
}