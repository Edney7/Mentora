package com.example.mentora.service.falta; // Ou o seu pacote de serviços

import com.example.mentora.dto.falta.FaltaCreateDTO;
import com.example.mentora.dto.falta.FaltaJustificativaDTO;
import com.example.mentora.dto.falta.FaltaResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface FaltaService {

    /**
     * Regista uma nova falta para um aluno numa disciplina específica, por um professor.
     * @param dto Os dados da falta a ser criada.
     * @return A FaltaResponseDTO da falta registada.
     * @throws RuntimeException Se o aluno, disciplina ou professor não forem encontrados,
     * ou se já existir uma falta para o mesmo aluno/disciplina/data,
     * ou outras validações de negócio falharem.
     */
    FaltaResponseDTO registarFalta(FaltaCreateDTO dto);

    /**
     * Justifica uma falta existente.
     * @param faltaId O ID da falta a ser justificada.
     * @param dto Contém a descrição da justificativa.
     * @return A FaltaResponseDTO da falta atualizada com a justificação.
     * @throws RuntimeException Se a falta não for encontrada.
     */
    FaltaResponseDTO justificarFalta(Long faltaId, FaltaJustificativaDTO dto);

    /**
     * Busca uma falta específica pelo seu ID.
     * @param id O ID da falta.
     * @return A FaltaResponseDTO da falta encontrada.
     * @throws RuntimeException Se a falta não for encontrada.
     */
    FaltaResponseDTO buscarFaltaPorId(Long id);

    /**
     * Lista todas as faltas de um aluno específico.
     * (Considerar filtrar por utilizador do aluno ativo).
     * @param alunoId O ID do aluno.
     * @return Uma lista de FaltaResponseDTOs.
     * @throws RuntimeException Se o aluno não for encontrado.
     */
    List<FaltaResponseDTO> listarFaltasPorAluno(Long alunoId);

    /**
     * Lista todas as faltas de um aluno específico para uma disciplina específica.
     * (Considerar filtrar por utilizador do aluno ativo).
     * @param alunoId O ID do aluno.
     * @param disciplinaId O ID da disciplina.
     * @return Uma lista de FaltaResponseDTOs.
     * @throws RuntimeException Se o aluno ou a disciplina não forem encontrados.
     */
    List<FaltaResponseDTO> listarFaltasPorAlunoEDisciplina(Long alunoId, Long disciplinaId);

    /**
     * Lista todas as faltas registadas por um professor específico.
     * (Considerar filtrar por utilizador do professor ativo).
     * @param professorId O ID do professor.
     * @return Uma lista de FaltaResponseDTOs.
     * @throws RuntimeException Se o professor não for encontrado.
     */
    List<FaltaResponseDTO> listarFaltasPorProfessor(Long professorId);

    /**
     * Lista todas as faltas registadas numa data específica.
     * @param dataFalta A data para filtrar as faltas.
     * @return Uma lista de FaltaResponseDTOs.
     */
    List<FaltaResponseDTO> listarFaltasPorData(LocalDate dataFalta);

    /**
     * Exclui uma falta específica.
     * A lógica de quem pode excluir deve ser implementada no serviço.
     * @param faltaId O ID da falta a ser excluída.
     * @throws RuntimeException se a falta não for encontrada ou se o utilizador não tiver permissão.
     */
    void excluirFalta(Long faltaId);

    List<FaltaResponseDTO> listarTodasFaltas();
}