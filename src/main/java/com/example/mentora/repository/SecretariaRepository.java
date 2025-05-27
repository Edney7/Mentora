package com.example.mentora.repository;

import com.example.mentora.model.Secretaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecretariaRepository extends JpaRepository<Secretaria, Long> {
}