package com.example.mentora.repository;

import com.example.mentora.model.Secretaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Importar Query
import org.springframework.stereotype.Repository;

import java.util.List; // Importar List
import java.util.Optional;

@Repository
public interface SecretariaRepository extends JpaRepository<Secretaria, Long> {

    // Verifica se um perfil de Secretaria já existe para um Utilizador
    boolean existsByUsuarioId(Long usuarioId);

    // Busca um perfil de Secretaria pelo ID do Utilizador associado (independente do estado do utilizador)
    Optional<Secretaria> findByUsuarioId(Long usuarioId);

    // NOVO: Busca um perfil de Secretaria pelo seu ID, mas somente se o Utilizador associado estiver ativo
    @Query("SELECT s FROM Secretaria s WHERE s.id = :secretariaId AND s.usuario.ativo = true")
    Optional<Secretaria> findByIdAndUsuarioAtivoTrue(Long secretariaId);

    // NOVO: Lista todos os perfis de Secretaria cujo Utilizador associado está ativo
    @Query("SELECT s FROM Secretaria s WHERE s.usuario.ativo = true")
    List<Secretaria> findAllWhereUsuarioAtivoTrue();
}
