package com.example.mentora.repository;

import com.example.mentora.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Métodos para verificar existência por email e cpf (independentemente do status ativo)
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);

    // Encontrar por email (para login)
    Optional<Usuario> findByEmail(String email);

    // Encontrar um usuário pelo ID somente se ele estiver ativo
    Optional<Usuario> findByIdAndAtivoTrue(Long id); // MÉTODO ADICIONADO

    // Listar todos os usuários que estão ativos
    List<Usuario> findAllByAtivoTrue(); // MÉTODO ADICIONADO

    // O JpaRepository já fornece findAll() e findById(Long id) que buscam todos,
    // independentemente do status 'ativo'.
}
