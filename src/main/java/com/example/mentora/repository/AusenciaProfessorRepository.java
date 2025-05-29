package com.example.mentora.repository; // Ou o seu pacote de repositórios

import com.example.mentora.model.AusenciaProfessor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AusenciaProfessorRepository extends JpaRepository<AusenciaProfessor, Long> {

    /**
     * Verifica se já existe uma ausência registada para um professor específico numa data específica.
     * @param professorId O ID do professor.
     * @param dataAusencia A data da ausência.
     * @return true se existir, false caso contrário.
     */
    boolean existsByProfessorIdAndDataAusencia(Long professorId, LocalDate dataAusencia);

    /**
     * Busca todas as ausências de um professor específico, ordenadas pela data da ausência de forma descendente.
     * @param professorId O ID do professor.
     * @return Lista de ausências do professor.
     */
    List<AusenciaProfessor> findByProfessorIdOrderByDataAusenciaDesc(Long professorId);

    /**
     * Busca todas as ausências registadas numa data específica.
     * @param dataAusencia A data da ausência.
     * @return Lista de ausências na data especificada.
     */
    List<AusenciaProfessor> findByDataAusencia(LocalDate dataAusencia);

    /**
     * Busca todas as ausências registadas, ordenadas pela data da ausência de forma descendente.
     * @return Lista de todas as ausências.
     */
    List<AusenciaProfessor> findAllByOrderByDataAusenciaDesc();

    // Outros métodos de busca podem ser adicionados conforme necessário.
    // Ex: List<AusenciaProfessor> findByDataAusenciaBetween(LocalDate inicio, LocalDate fim);
}
