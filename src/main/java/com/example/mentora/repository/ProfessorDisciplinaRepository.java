package com.example.mentora.repository; // Ou o seu pacote de repositórios

import com.example.mentora.model.ProfessorDisciplina;
import com.example.mentora.model.ProfessorDisciplinaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfessorDisciplinaRepository extends JpaRepository<ProfessorDisciplina, ProfessorDisciplinaId> {

    /**
     * Encontra todas as associações ProfessorDisciplina para um determinado ID de Professor.
     * @param professorId O ID do Professor.
     * @return Uma lista de associações ProfessorDisciplina.
     */
    List<ProfessorDisciplina> findByProfessorId(Long professorId);

    /**
     * Encontra todas as associações ProfessorDisciplina para um determinado ID de Disciplina.
     * @param disciplinaId O ID da Disciplina.
     * @return Uma lista de associações ProfessorDisciplina.
     */
    List<ProfessorDisciplina> findByDisciplinaId(Long disciplinaId);

    /**
     * Apaga todas as associações ProfessorDisciplina para um determinado ID de Professor.
     * Útil para o método de atualizar todas as disciplinas de um professor.
     * @param professorId O ID do Professor.
     */
    @Modifying // Indica que esta query modifica dados
    @Query("DELETE FROM ProfessorDisciplina pd WHERE pd.professor.id = :professorId")
    void deleteByProfessorId(@Param("professorId") Long professorId);

    /**
     * Apaga todas as associações ProfessorDisciplina para um determinado ID de Disciplina.
     * Pode ser útil se, ao apagar uma disciplina, quisermos desvincular todos os professores.
     * @param disciplinaId O ID da Disciplina.
     */
    @Modifying
    @Query("DELETE FROM ProfessorDisciplina pd WHERE pd.disciplina.id = :disciplinaId")
    void deleteByDisciplinaId(@Param("disciplinaId") Long disciplinaId);
}
