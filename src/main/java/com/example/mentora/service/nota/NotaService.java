package com.example.mentora.service.nota; // Ou o seu pacote de serviços

import com.example.mentora.dto.nota.NotaCreateDTO;
import com.example.mentora.dto.nota.NotaResponseDTO;
import com.example.mentora.dto.nota.NotaUpdateDTO; // Importar se for adicionar método de atualização

import java.util.List;

public interface NotaService {

    /**
     * Lança (cria) uma nova nota para um aluno numa disciplina específica, registando o professor que a lançou.
     * @param dto Os dados da nota a ser criada, incluindo alunoId, disciplinaId, professorId e valor.
     * @return A NotaResponseDTO da nota criada.
     * @throws RuntimeException se o aluno, disciplina ou professor não forem encontrados, ou outras validações de negócio falharem.
     */
    NotaResponseDTO lancarNota(NotaCreateDTO dto);

    /**
     * Busca uma nota específica pelo seu ID.
     * @param id O ID da nota.
     * @return A NotaResponseDTO da nota encontrada.
     * @throws RuntimeException se a nota não for encontrada.
     */
    NotaResponseDTO buscarNotaPorId(Long id);

    /**
     * Lista todas as notas de um aluno específico.
     * @param alunoId O ID do aluno.
     * @return Uma lista de NotaResponseDTOs.
     * @throws RuntimeException se o aluno não for encontrado.
     */
    List<NotaResponseDTO> listarNotasPorAluno(Long alunoId);

    /**
     * Lista todas as notas de um aluno específico para uma disciplina específica.
     * @param alunoId O ID do aluno.
     * @param disciplinaId O ID da disciplina.
     * @return Uma lista de NotaResponseDTOs.
     * @throws RuntimeException se o aluno ou a disciplina não forem encontrados.
     */
    List<NotaResponseDTO> listarNotasPorAlunoEDisciplina(Long alunoId, Long disciplinaId);

    List<NotaResponseDTO> listarTodasNotas();
    // --- Métodos Opcionais (descomente e defina se necessário) ---

    /**
     * Atualiza uma nota existente.
     * A lógica de quem pode atualizar (ex: apenas o professor que lançou) deve ser implementada no serviço.
     * @param notaId O ID da nota a ser atualizada.
     * @param dto Os dados para atualização.
     * @return A NotaResponseDTO da nota atualizada.
     * @throws RuntimeException se a nota não for encontrada ou se o utilizador não tiver permissão.
     */
    // NotaResponseDTO atualizarNota(Long notaId, NotaUpdateDTO dto);

    /**
     * Exclui uma nota específica.
     * A lógica de quem pode excluir deve ser implementada no serviço.
     * @param notaId O ID da nota a ser excluída.
     * @throws RuntimeException se a nota não for encontrada ou se o utilizador não tiver permissão.
     */
    // void excluirNota(Long notaId);

    /**
     * Lista todas as notas lançadas por um professor específico.
     * @param professorId O ID do professor.
     * @return Uma lista de NotaResponseDTOs.
     * @throws RuntimeException se o professor não for encontrado.
     */
    // List<NotaResponseDTO> listarNotasPorProfessor(Long professorId);
}