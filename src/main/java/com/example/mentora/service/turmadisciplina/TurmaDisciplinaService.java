package com.example.mentora.service.turmadisciplina;

import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.turmadisciplina.AtualizarDisciplinasTurmaRequestDTO;
import com.example.mentora.dto.turmadisciplina.VincularDisciplinaTurmaRequestDTO;
import java.util.List;

public interface TurmaDisciplinaService {

    /**
     * Vincula uma única disciplina a uma turma.
     * @param dto Contém os IDs da turma e da disciplina.
     * @throws RuntimeException se a turma ou disciplina não for encontrada, ou se o vínculo já existir.
     */
    void vincularDisciplina(VincularDisciplinaTurmaRequestDTO dto);

    /**
     * Desvincula uma disciplina específica de uma turma.
     * @param turmaId ID da turma.
     * @param disciplinaId ID da disciplina.
     * @throws RuntimeException se o vínculo não for encontrado.
     */
    void desvincularDisciplina(Long turmaId, Long disciplinaId);

    /**
     * Atualiza todas as disciplinas associadas a uma turma.
     * As associações existentes são removidas e as novas são criadas com base na lista de IDs fornecida.
     * @param dto Contém o ID da turma e a lista de IDs das disciplinas.
     * @throws RuntimeException se a turma ou alguma das disciplinas não for encontrada.
     */
    void atualizarDisciplinasDaTurma(AtualizarDisciplinasTurmaRequestDTO dto);

    /**
     * Lista todas as disciplinas associadas a uma turma específica.
     * @param turmaId ID da turma.
     * @return Lista de DisciplinaResponseDTO.
     * @throws RuntimeException se a turma não for encontrada.
     */
    List<DisciplinaResponseDTO> listarDisciplinasPorTurma(Long turmaId);
}
