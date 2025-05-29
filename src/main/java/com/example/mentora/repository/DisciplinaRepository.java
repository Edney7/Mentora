package com.example.mentora.repository; // Ou o seu pacote de repositórios

import com.example.mentora.model.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {

    /**
     * Verifica se uma disciplina com o nome fornecido já existe.
     * Útil para validação antes de criar uma nova disciplina.
     * @param nome O nome da disciplina a ser verificado.
     * @return true se uma disciplina com esse nome existir, false caso contrário.
     */
    boolean existsByNome(String nome);

    /**
     * Busca uma disciplina pelo nome.
     * Pode ser útil se o nome for um identificador de negócio.
     * @param nome O nome da disciplina a ser buscada.
     * @return Um Optional contendo a Disciplina se encontrada, ou Optional.empty() caso contrário.
     */
    Optional<Disciplina> findByNome(String nome);

    // Pode adicionar outros métodos de busca personalizados aqui conforme a necessidade.
    // Exemplo: List<Disciplina> findByAtivaTrue(); // Se adicionar o campo 'ativa'
}
