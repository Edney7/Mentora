package com.example.mentora.repository;

import com.example.mentora.model.TurmaDisciplinaProfessor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface TurmaDisciplinaProfessorRepository extends JpaRepository<TurmaDisciplinaProfessor, Long> {
    // Método para buscar todas as ofertas de uma turma
    List<TurmaDisciplinaProfessor> findByTurmaId(Long turmaId);

    // Método para verificar se já existe uma disciplina vinculada a um professor em uma turma (opcional, mas bom)
    Optional<TurmaDisciplinaProfessor> findByTurmaIdAndDisciplinaId(Long turmaId, Long disciplinaId);
    List<TurmaDisciplinaProfessor> findByProfessorId(Long professorId);
}
