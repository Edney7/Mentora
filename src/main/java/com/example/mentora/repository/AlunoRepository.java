package com.example.mentora.repository;

import com.example.mentora.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    boolean existsByUsuarioId(Long usuarioId);
    Optional<Aluno> findByUsuarioId(Long usuarioId);

    @Query("SELECT a FROM Aluno a WHERE a.id = :alunoId AND a.usuario.ativo = true")
    Optional<Aluno> findByIdAndUsuarioAtivoTrue(@Param("alunoId") Long alunoId);

    @Query("SELECT a FROM Aluno a WHERE a.usuario.ativo = true")
    List<Aluno> findAllWhereUsuarioAtivoTrue();

    @Query("SELECT a FROM Aluno a WHERE a.turma.id = :turmaId AND a.usuario.ativo = true ORDER BY a.usuario.nome ASC")
    List<Aluno> findByTurmaIdAndUsuarioAtivoTrue(@Param("turmaId") Long turmaId);

}
