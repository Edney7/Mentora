package com.example.mentora.repository;

import com.example.mentora.model.TurmaDisciplina;
import com.example.mentora.model.TurmaDisciplinaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaDisciplinaRepository extends JpaRepository<TurmaDisciplina, TurmaDisciplinaId> {

    // Encontra todas as associações TurmaDisciplina para um determinado turmaId.
    // O Spring Data JPA infere a query pelo nome do método.
    List<TurmaDisciplina> findByTurmaId(Long turmaId);

    // Encontra todas as associações TurmaDisciplina para um determinado disciplinaId.
    List<TurmaDisciplina> findByDisciplinaId(Long disciplinaId);

    // Método customizado para deletar todas as associações por turmaId.
    // Necessário para a operação de "atualizarDisciplinasDaTurma" de forma eficiente.
    @Modifying // Indica que esta query modifica dados (DELETE, UPDATE, INSERT)
    @Query("DELETE FROM TurmaDisciplina td WHERE td.turma.id = :turmaId")
    void deleteByTurmaId(@Param("turmaId") Long turmaId);
}
