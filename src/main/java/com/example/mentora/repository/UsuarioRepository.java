package com.example.mentora.repository;

import com.example.mentora.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método de instância: Spring Data JPA fornecerá a implementação
    boolean existsByCpf(String cpf);

    // Método de instância CORRIGIDO: Removido 'static' e a implementação manual
    boolean existsByEmail(String email);

    // Método de instância: Spring Data JPA fornecerá a implementação
    Optional<Usuario> findByEmail(String email);

}