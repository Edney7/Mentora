package com.example.mentora.repository;

import com.example.mentora.model.AusenciaProfessor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AusenciaProfessorRepository extends JpaRepository<AusenciaProfessor, Long> {

    boolean existsByProfessorIdAndDataAusencia(Long professorId, LocalDate dataAusencia);

    List<AusenciaProfessor> findByProfessorIdOrderByDataAusenciaDesc(Long professorId);

    List<AusenciaProfessor> findByDataAusencia(LocalDate dataAusencia);

    List<AusenciaProfessor> findAllByOrderByDataAusenciaDesc();

}