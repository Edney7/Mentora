package com.example.mentora.repository; // Ou o seu pacote de repositórios

import com.example.mentora.model.Falta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FaltaRepository extends JpaRepository<Falta, Long> {

    /**
     * Busca todas as faltas registradas para um aluno específico.
     * @param alunoId O ID do aluno.
     * @return Uma lista de faltas do aluno.
     */
    List<Falta> findByAlunoId(Long alunoId);

    /**
     * Busca todas as faltas registradas para um aluno específico em uma disciplina específica.
     * @param alunoId O ID do aluno.
     * @param disciplinaId O ID da disciplina.
     * @return Uma lista de faltas do aluno na disciplina.
     */
    List<Falta> findByAlunoIdAndDisciplinaId(Long alunoId, Long disciplinaId);

    /**
     * Busca todas as faltas registradas para um aluno específico em uma disciplina específica em uma data específica.
     * Útil para verificar a restrição de unicidade antes de salvar, ou para buscar uma falta específica.
     * @param alunoId O ID do aluno.
     * @param disciplinaId O ID da disciplina.
     * @param dataFalta A data da falta.
     * @return Um Optional contendo a Falta se encontrada.
     */
    Optional<Falta> findByAlunoIdAndDisciplinaIdAndDataFalta(Long alunoId, Long disciplinaId, LocalDate dataFalta);

    /**
     * Verifica se já existe um registro de falta para um aluno, disciplina e data específicos.
     * @param alunoId O ID do aluno.
     * @param disciplinaId O ID da disciplina.
     * @param dataFalta A data da falta.
     * @return true se o registro existir, false caso contrário.
     */
    boolean existsByAlunoIdAndDisciplinaIdAndDataFalta(Long alunoId, Long disciplinaId, LocalDate dataFalta);

    /**
     * Busca todas as faltas registradas para uma disciplina específica (para todos os alunos).
     * @param disciplinaId O ID da disciplina.
     * @return Uma lista de faltas na disciplina.
     */
    List<Falta> findByDisciplinaId(Long disciplinaId);

    /**
     * Busca todas as faltas registradas por um professor específico.
     * @param professorId O ID do professor.
     * @return Lista de faltas registradas pelo professor.
     */
    List<Falta> findByProfessorId(Long professorId);

    /**
     * Busca todas as faltas registradas em uma data específica.
     * @param dataFalta A data da falta.
     * @return Lista de faltas na data especificada.
     */
    List<Falta> findByDataFalta(LocalDate dataFalta);
}
