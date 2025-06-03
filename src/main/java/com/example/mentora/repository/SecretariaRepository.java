package com.example.mentora.repository;

import com.example.mentora.model.Secretaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Importar Query
import org.springframework.stereotype.Repository;

import java.util.List; // Importar List
import java.util.Optional;

@Repository
public interface SecretariaRepository extends JpaRepository<Secretaria, Long> {

    boolean existsByUsuarioId(Long usuarioId);

    Optional<Secretaria> findByUsuarioId(Long usuarioId);

    @Query("SELECT s FROM Secretaria s WHERE s.id = :secretariaId AND s.usuario.ativo = true")
    Optional<Secretaria> findByIdAndUsuarioAtivoTrue(Long secretariaId);

    @Query("SELECT s FROM Secretaria s WHERE s.usuario.ativo = true")
    List<Secretaria> findAllWhereUsuarioAtivoTrue();
}
