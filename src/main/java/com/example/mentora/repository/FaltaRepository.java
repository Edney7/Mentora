package com.example.mentora.repository;

import com.example.mentora.model.Falta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FaltaRepository extends JpaRepository<Falta, Long> {

    List<Falta> findByAlunoId(Long alunoId);

    List<Falta> findByAlunoIdAndDisciplinaId(Long alunoId, Long disciplinaId);

    Optional<Falta> findByAlunoIdAndDisciplinaIdAndDataFalta(Long alunoId, Long disciplinaId, LocalDate dataFalta);

    boolean existsByAlunoIdAndDisciplinaIdAndDataFalta(Long alunoId, Long disciplinaId, LocalDate dataFalta);

    List<Falta> findByDisciplinaId(Long disciplinaId);

    List<Falta> findByProfessorId(Long professorId);

    List<Falta> findByDataFalta(LocalDate dataFalta);
}
