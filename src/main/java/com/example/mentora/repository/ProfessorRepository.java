package com.example.mentora.repository;

import com.example.mentora.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Importar Query
import org.springframework.stereotype.Repository;

import java.util.List; // Importar List
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    // Verifica se um perfil de Professor já existe para um Usuário
    boolean existsByUsuarioId(Long usuarioId);

    // Busca um Professor pelo ID do Usuário associado (independente do status do usuário)
    Optional<Professor> findByUsuarioId(Long usuarioId);

    // NOVO: Busca um Professor pelo seu ID, mas somente se o Usuário associado estiver ativo
    @Query("SELECT p FROM Professor p WHERE p.id = :professorId AND p.usuario.ativo = true")
    Optional<Professor> findByIdAndUsuarioAtivoTrue(Long professorId);

    // NOVO: Lista todos os Professores cujo Usuário associado está ativo
    @Query("SELECT p FROM Professor p WHERE p.usuario.ativo = true")
    List<Professor> findAllWhereUsuarioAtivoTrue();
}
