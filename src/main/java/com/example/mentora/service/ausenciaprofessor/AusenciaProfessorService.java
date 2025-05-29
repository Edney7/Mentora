package com.example.mentora.service.ausenciaprofessor; // Crie este pacote se necessário

import com.example.mentora.dto.ausenciaprofessor.AusenciaProfessorCreateDTO;
import com.example.mentora.dto.ausenciaprofessor.AusenciaProfessorResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface AusenciaProfessorService {

    /**
     * Regista uma nova ausência planeada para um professor.
     * @param dto Os dados da ausência a ser criada.
     * @param professorLogadoId O ID do professor autenticado que está a registar a sua própria ausência,
     * ou null se for uma secretaria a registar em nome de um professor (nesse caso, o professorId do DTO é usado).
     * @return A AusenciaProfessorResponseDTO da ausência registada.
     * @throws RuntimeException Se o professor não for encontrado, ou outras validações de negócio falharem.
     */
    AusenciaProfessorResponseDTO registarAusencia(AusenciaProfessorCreateDTO dto, Long professorLogadoId);

    /**
     * Busca uma ausência específica pelo seu ID.
     * @param id O ID da ausência.
     * @return A AusenciaProfessorResponseDTO da ausência encontrada.
     * @throws RuntimeException Se a ausência não for encontrada.
     */
    AusenciaProfessorResponseDTO buscarAusenciaPorId(Long id);

    /**
     * Lista todas as ausências registadas para um professor específico.
     * (Considerar filtrar por utilizador do professor ativo).
     * @param professorId O ID do professor.
     * @return Uma lista de AusenciaProfessorResponseDTOs.
     * @throws RuntimeException Se o professor não for encontrado.
     */
    List<AusenciaProfessorResponseDTO> listarAusenciasPorProfessor(Long professorId);

    /**
     * Lista todas as ausências registadas numa data específica.
     * @param dataAusencia A data para filtrar as ausências.
     * @return Uma lista de AusenciaProfessorResponseDTOs.
     */
    List<AusenciaProfessorResponseDTO> listarAusenciasPorData(LocalDate dataAusencia);

    /**
     * Lista todas as ausências planeadas (ex: para a secretaria visualizar).
     * Poderia ter filtros adicionais (ex: por período).
     * @return Uma lista de todas as AusenciaProfessorResponseDTOs.
     */
    List<AusenciaProfessorResponseDTO> listarTodasAusencias();

    /**
     * Cancela (exclui) uma ausência planeada.
     * A lógica de quem pode cancelar (ex: o próprio professor ou a secretaria) deve ser implementada no serviço.
     * @param ausenciaId O ID da ausência a ser cancelada.
     * @param usuarioLogadoId O ID do utilizador que está a tentar cancelar (para verificação de permissão).
     * @throws RuntimeException se a ausência não for encontrada ou se o utilizador não tiver permissão.
     */
    void cancelarAusencia(Long ausenciaId, Long usuarioLogadoId);

    // Poderiam existir métodos para atualizar uma ausência, se permitido pelas regras de negócio.
    // AusenciaProfessorResponseDTO atualizarAusencia(Long ausenciaId, AusenciaProfessorUpdateDTO dto, Long professorLogadoId);
}
