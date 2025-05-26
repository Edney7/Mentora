package com.example.mentora.repository;

import com.example.mentora.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByCpf(String cpf);

    static boolean existsByEmail(String email) {
        return false;
    }

    Optional<Usuario> findByEmail(String email);

}
