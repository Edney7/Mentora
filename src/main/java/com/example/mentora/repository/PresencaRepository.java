// Exemplo de como sua interface PresencaRepository.java DEVE ser
package com.example.mentora.repository;

import com.example.mentora.model.Presenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PresencaRepository extends JpaRepository<Presenca, Long> { // Substitua Long pelo tipo do ID da sua entidade Presenca
}