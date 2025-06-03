package com.example.mentora.repository;

import com.example.mentora.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {

    List<Nota> findByAlunoId(Long alunoId);

    List<Nota> findByAlunoIdAndDisciplinaId(Long alunoId, Long disciplinaId);

    List<Nota> findByDisciplinaId(Long disciplinaId);

    List<Nota> findByProfessorId(Long professorId);
}
