package com.example.mentora.repository;

import com.example.mentora.model.Turma; // Certifique-se que você tem a entidade Turma
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {
}