package com.example.mentora.repository;

import com.example.mentora.model.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {

    boolean existsByNome(String nome);

    Optional<Disciplina> findByNome(String nome);

}
