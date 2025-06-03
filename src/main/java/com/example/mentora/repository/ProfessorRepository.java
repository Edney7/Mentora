package com.example.mentora.repository;

import com.example.mentora.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Importar Query
import org.springframework.stereotype.Repository;

import java.util.List; // Importar List
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    boolean existsByUsuarioId(Long usuarioId);

    Optional<Professor> findByUsuarioId(Long usuarioId);

    @Query("SELECT p FROM Professor p WHERE p.id = :professorId AND p.usuario.ativo = true")
    Optional<Professor> findByIdAndUsuarioAtivoTrue(Long professorId);

    @Query("SELECT p FROM Professor p WHERE p.usuario.ativo = true")
    List<Professor> findAllWhereUsuarioAtivoTrue();
}
