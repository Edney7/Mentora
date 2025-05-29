package com.example.mentora.repository; // Ou o seu pacote de repositórios

import com.example.mentora.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {

    /**
     * Encontra todas as notas de um aluno específico.
     * O Spring Data JPA gera a query baseada no nome do método.
     * 'Aluno' é a propriedade na entidade Nota, e 'Id' é a propriedade id dentro de Aluno.
     * @param alunoId O ID do aluno.
     * @return Lista de notas do aluno.
     */
    List<Nota> findByAlunoId(Long alunoId);

    /**
     * Encontra todas as notas de um aluno específico para uma disciplina específica.
     * @param alunoId O ID do aluno.
     * @param disciplinaId O ID da disciplina.
     * @return Lista de notas do aluno para a disciplina.
     */
    List<Nota> findByAlunoIdAndDisciplinaId(Long alunoId, Long disciplinaId);

    /**
     * Encontra todas as notas de uma disciplina específica (para todos os alunos).
     * @param disciplinaId O ID da disciplina.
     * @return Lista de notas para a disciplina.
     */
    List<Nota> findByDisciplinaId(Long disciplinaId);

    /**
     * Encontra todas as notas lançadas por um professor específico.
     * (Necessário se for implementar o método listarNotasPorProfessor no NotaService)
     * @param professorId O ID do professor.
     * @return Lista de notas lançadas pelo professor.
     */
    List<Nota> findByProfessorId(Long professorId); // Adicionado para a funcionalidade opcional
}
