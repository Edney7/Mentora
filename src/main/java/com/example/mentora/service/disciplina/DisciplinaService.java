package com.example.mentora.service.disciplina; // Ou o seu pacote de serviços

import com.example.mentora.dto.disciplina.DisciplinaCreateDTO;
import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.disciplina.DisciplinaUpdateDTO;

import java.util.List;

public interface DisciplinaService {

    /**
     * Cadastra uma nova disciplina no sistema.
     * @param dto Os dados da disciplina a ser criada.
     * @return A disciplina cadastrada.
     * @throws RuntimeException se uma disciplina com o mesmo nome já existir.
     */
    DisciplinaResponseDTO cadastrar(DisciplinaCreateDTO dto);

    /**
     * Lista todas as disciplinas cadastradas.
     * (Se houver soft delete, este método listaria apenas as ativas por padrão).
     * @return Uma lista de todas as disciplinas.
     */
    List<DisciplinaResponseDTO> listarTodas();

    /**
     * Busca uma disciplina pelo seu ID.
     * @param id O ID da disciplina.
     * @return A disciplina encontrada.
     * @throws RuntimeException se a disciplina não for encontrada.
     */
    DisciplinaResponseDTO buscarPorId(Long id);

    /**
     * Atualiza os dados de uma disciplina existente.
     * @param id O ID da disciplina a ser atualizada.
     * @param dto Os dados para atualização.
     * @return A disciplina atualizada.
     * @throws RuntimeException se a disciplina não for encontrada ou se o novo nome já estiver em uso por outra disciplina.
     */
    DisciplinaResponseDTO atualizar(Long id, DisciplinaUpdateDTO dto);

    /**
     * Exclui uma disciplina do sistema.
     * (Se houver soft delete, este método desativaria a disciplina).
     * @param id O ID da disciplina a ser excluída.
     * @throws RuntimeException se a disciplina não for encontrada ou se não puder ser excluída (ex: vinculada a turmas/professores).
     */
    void excluir(Long id);
}
