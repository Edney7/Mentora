package com.example.mentora.repository;

import com.example.mentora.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {

    Optional<Turma> findByIdAndAtivaTrue(Long id);

    List<Turma> findAllByAtivaTrue();

    boolean existsByIdAndAtivaTrue(Long id);

}
