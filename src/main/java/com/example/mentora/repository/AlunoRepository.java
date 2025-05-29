package com.example.mentora.repository;

import com.example.mentora.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Importar Query
import org.springframework.stereotype.Repository;

import java.util.List; // Importar List
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    // Verifica se um perfil de Aluno já existe para um Usuário
    boolean existsByUsuarioId(Long usuarioId);

    // Busca um Aluno pelo ID do Usuário associado (independente do status do usuário)
    Optional<Aluno> findByUsuarioId(Long usuarioId);

    // NOVO: Busca um Aluno pelo seu ID, mas somente se o Usuário associado estiver ativo
    @Query("SELECT a FROM Aluno a WHERE a.id = :alunoId AND a.usuario.ativo = true")
    Optional<Aluno> findByIdAndUsuarioAtivoTrue(Long alunoId);

    // NOVO: Lista todos os Alunos cujo Usuário associado está ativo
    @Query("SELECT a FROM Aluno a WHERE a.usuario.ativo = true")
    List<Aluno> findAllWhereUsuarioAtivoTrue();
}
