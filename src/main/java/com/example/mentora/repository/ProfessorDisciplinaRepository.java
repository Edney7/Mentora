package com.example.mentora.repository;

import com.example.mentora.model.ProfessorDisciplina;
import com.example.mentora.model.ProfessorDisciplinaId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfessorDisciplinaRepository extends JpaRepository<ProfessorDisciplina, ProfessorDisciplinaId> {
    List<ProfessorDisciplina> findByProfessorId(Long idProfessor);
}

