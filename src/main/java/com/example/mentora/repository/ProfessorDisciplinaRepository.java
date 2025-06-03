package com.example.mentora.repository;

import com.example.mentora.model.ProfessorDisciplina;
import com.example.mentora.model.ProfessorDisciplinaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfessorDisciplinaRepository extends JpaRepository<ProfessorDisciplina, ProfessorDisciplinaId> {

    List<ProfessorDisciplina> findByProfessorId(Long professorId);

    List<ProfessorDisciplina> findByDisciplinaId(Long disciplinaId);

    @Modifying
    @Query("DELETE FROM ProfessorDisciplina pd WHERE pd.professor.id = :professorId")
    void deleteByProfessorId(@Param("professorId") Long professorId);

    @Modifying
    @Query("DELETE FROM ProfessorDisciplina pd WHERE pd.disciplina.id = :disciplinaId")
    void deleteByDisciplinaId(@Param("disciplinaId") Long disciplinaId);
}
