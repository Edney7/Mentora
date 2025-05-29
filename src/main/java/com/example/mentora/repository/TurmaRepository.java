package com.example.mentora.repository;

import com.example.mentora.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {

    // Encontra uma turma pelo ID somente se ela estiver ativa
    Optional<Turma> findByIdAndAtivaTrue(Long id);

    // Lista todas as turmas que estão ativas
    List<Turma> findAllByAtivaTrue();

    // Exemplo: Verificar se existe turma com mesmo nome e ano letivo (pode ser útil)
    // boolean existsByNomeAndAnoLetivo(String nome, Integer anoLetivo);

    // O JpaRepository já fornece findAll() e findById(Long id) que buscam todas,
    // independentemente do status 'ativa'.
}
