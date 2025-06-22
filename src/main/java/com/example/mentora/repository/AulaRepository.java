package com.example.mentora.repository;

import com.example.mentora.model.Aula;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Professor;
import com.example.mentora.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {
    // Para contar aulas por turma e disciplina (usado no resumo de faltas)
    int countByTurmaIdAndDisciplinaId(Long turmaId, Long disciplinaId);

    // 2. Método para encontrar uma aula específica por seus critérios únicos (usado em AulaService.criarOuObterAula)
    // Este é crucial para garantir que você não crie aulas duplicadas para a mesma turma, disciplina, professor e data.
    Optional<Aula> findByDisciplinaAndProfessorAndTurmaAndDataAula(Disciplina disciplina, Professor professor, Turma turma, LocalDate dataAula);

    // 3. Método para listar todas as aulas ministradas por um professor (usado em AulaService.listarAulasPorProfessor)
    List<Aula> findByProfessor(Professor professor);

    // 4. Método para listar aulas de um professor para uma disciplina e turma específicas (usado em AulaService.listarAulasPorProfessorEDisciplinaETurma)
    List<Aula> findByProfessorAndDisciplinaAndTurma(Professor professor, Disciplina disciplina, Turma turma);


}
