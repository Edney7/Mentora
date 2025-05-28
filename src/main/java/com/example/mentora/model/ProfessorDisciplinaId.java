package com.example.mentora.model; // Ou o seu pacote de modelo

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Setter
@Getter
public class ProfessorDisciplinaId implements Serializable {

    // Getters, Setters (Lombok @Getter @Setter também funcionaria aqui)
    private Long professor; // Corresponde ao tipo do ID em Professor e ao nome do campo na entidade ProfessorDisciplina
    private Long disciplina; // Corresponde ao tipo do ID em Disciplina e ao nome do campo na entidade ProfessorDisciplina

    // Construtor padrão é necessário para JPA
    public ProfessorDisciplinaId() {
    }

    public ProfessorDisciplinaId(Long professorId, Long disciplinaId) {
        this.professor = professorId;
        this.disciplina = disciplinaId;
    }

    // Métodos equals() e hashCode() são cruciais para chaves compostas
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProfessorDisciplinaId that = (ProfessorDisciplinaId) o;
        return Objects.equals(professor, that.professor) &&
                Objects.equals(disciplina, that.disciplina);
    }

    @Override
    public int hashCode() {
        return Objects.hash(professor, disciplina);
    }
}