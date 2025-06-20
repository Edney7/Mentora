package com.example.mentora.repository;

import com.example.mentora.model.Aula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {
    // Para contar aulas por turma e disciplina (usado no resumo de faltas)
    int countByTurmaIdAndDisciplinaId(Long turmaId, Long disciplinaId);

    // Você pode precisar de outros métodos aqui, como:
    // List<Aula> findByTurmaIdAndDisciplinaId(Long turmaId, Long disciplinaId);
    // List<Aula> findByProfessorIdAndDataAula(Long professorId, LocalDate dataAula);
}
