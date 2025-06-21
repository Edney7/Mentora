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

    List<Falta> findByAlunoIdAndAula_DisciplinaId(Long alunoId, Long disciplinaId);

    //Optional<Falta> findByAlunoIdAndDisciplinaIdAndDataFalta(Long alunoId, Long disciplinaId, LocalDate dataFalta);
    boolean existsByAlunoIdAndAulaId(Long alunoId, Long aulaId);
    //boolean existsByAlunoIdAndDisciplinaIdAndDataFalta(Long alunoId, Long disciplinaId, LocalDate dataFalta);
    Optional<Falta> findByAlunoIdAndAula_Disciplina_IdAndAula_DataAula(Long alunoId, Long disciplinaId, LocalDate dataAula);
    boolean existsByAlunoIdAndAula_Disciplina_IdAndAula_DataAula(Long alunoId, Long disciplinaId, LocalDate dataAula);
    List<Falta> findByAula_Disciplina_Id(Long disciplinaId);


    List<Falta> findByAula_DataAula(LocalDate dataAula);
    List<Falta> findByProfessorQueRegistrouId(Long professorId);
}
