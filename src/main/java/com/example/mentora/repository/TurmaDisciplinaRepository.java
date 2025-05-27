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

    // Método para encontrar todas as associações por ID da Turma.
    // O nome do método segue a convenção do Spring Data JPA para gerar a query.
    // 'Turma' é a propriedade na entidade TurmaDisciplina, e 'Id' é a propriedade id dentro de Turma.
    List<TurmaDisciplina> findByTurmaId(Long turmaId);

    // Método para encontrar todas as associações por ID da Disciplina.
    List<TurmaDisciplina> findByDisciplinaId(Long disciplinaId);

    // Método customizado para deletar todas as associações por ID da Turma.
    // Útil para o método atualizarDisciplinasDaTurma no serviço.
    // @Modifying indica que esta query altera dados.
    // @Query permite escrever uma JPQL ou SQL nativa.
    @Modifying
    @Query("DELETE FROM TurmaDisciplina td WHERE td.turma.id = :turmaId")
    void deleteByTurmaId(@Param("turmaId") Long turmaId);

    // Opcional: Método para deletar por ID da Disciplina, se necessário.
    // @Modifying
    // @Query("DELETE FROM TurmaDisciplina td WHERE td.disciplina.id = :disciplinaId")
    // void deleteByDisciplinaId(@Param("disciplinaId") Long disciplinaId);
}
