package com.example.mentora.service.disciplina;

import com.example.mentora.dto.disciplina.DisciplinaCreateDTO;
import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.disciplina.DisciplinaUpdateDTO;
import com.example.mentora.model.Disciplina;
import com.example.mentora.repository.DisciplinaRepository;
// Importar TurmaDisciplinaRepository se precisar verificar vínculos antes de excluir
// import com.example.mentora.repository.TurmaDisciplinaRepository;
// Importar ProfessorDisciplinaRepository se precisar verificar vínculos antes de excluir
// import com.example.mentora.repository.ProfessorDisciplinaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DisciplinaServiceImpl implements DisciplinaService {

    private static final Logger log = LoggerFactory.getLogger(DisciplinaServiceImpl.class);

    private final DisciplinaRepository disciplinaRepository;
    // private final TurmaDisciplinaRepository turmaDisciplinaRepository; // Para verificar vínculos
    // private final ProfessorDisciplinaRepository professorDisciplinaRepository; // Para verificar vínculos


    @Autowired
    public DisciplinaServiceImpl(DisciplinaRepository disciplinaRepository
                                 /*, TurmaDisciplinaRepository turmaDisciplinaRepository,
                                 ProfessorDisciplinaRepository professorDisciplinaRepository */) {
        this.disciplinaRepository = disciplinaRepository;
        // this.turmaDisciplinaRepository = turmaDisciplinaRepository;
        // this.professorDisciplinaRepository = professorDisciplinaRepository;
    }

    // Método auxiliar para converter Entidade para DTO
    private DisciplinaResponseDTO toResponseDTO(Disciplina disciplina) {
        return DisciplinaResponseDTO.builder()
                .id(disciplina.getId())
                .nome(disciplina.getNome())
                .descricao(disciplina.getDescricao())
                // .ativa(disciplina.getAtiva()) // Se tiver soft delete
                .build();
    }

    @Override
    @Transactional
    public DisciplinaResponseDTO cadastrar(DisciplinaCreateDTO dto) {
        log.info("Cadastrando nova disciplina: {}", dto.getNome());
        // Verifica se já existe uma disciplina com o mesmo nome
        if (disciplinaRepository.existsByNome(dto.getNome())) {
            log.warn("Tentativa de cadastrar disciplina com nome duplicado: {}", dto.getNome());
            throw new RuntimeException("Já existe uma disciplina cadastrada com o nome: " + dto.getNome());
            // Considere uma BusinessRuleException ou DuplicateResourceException
        }

        Disciplina disciplina = new Disciplina();
        disciplina.setNome(dto.getNome());
        disciplina.setDescricao(dto.getDescricao());
        // disciplina.setAtiva(dto.getAtiva() != null ? dto.getAtiva() : true); // Se tiver soft delete

        Disciplina disciplinaSalva = disciplinaRepository.save(disciplina);
        log.info("Disciplina cadastrada com ID: {}", disciplinaSalva.getId());
        return toResponseDTO(disciplinaSalva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisciplinaResponseDTO> listarTodas() {
        log.info("Listando todas as disciplinas");
        // Se tiver soft delete, seria: disciplinaRepository.findAllByAtivaTrue()
        return disciplinaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DisciplinaResponseDTO buscarPorId(Long id) {
        log.info("Buscando disciplina com ID: {}", id);
        // Se tiver soft delete, seria: disciplinaRepository.findByIdAndAtivaTrue(id)
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Disciplina com ID: {} não encontrada.", id);
                    // Considere uma ResourceNotFoundException
                    return new RuntimeException("Disciplina com ID " + id + " não encontrada.");
                });
        return toResponseDTO(disciplina);
    }

    @Override
    @Transactional
    public DisciplinaResponseDTO atualizar(Long id, DisciplinaUpdateDTO dto) {
        log.info("Atualizando disciplina com ID: {}", id);
        Disciplina disciplinaExistente = disciplinaRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Disciplina com ID: {} não encontrada para atualização.", id);
                    return new RuntimeException("Disciplina com ID " + id + " não encontrada para atualização.");
                });

        boolean modificado = false;

        // Verifica se o nome foi alterado e se o novo nome já existe para outra disciplina
        if (dto.getNome() != null && !dto.getNome().isBlank() && !dto.getNome().equals(disciplinaExistente.getNome())) {
            Optional<Disciplina> disciplinaComNovoNome = disciplinaRepository.findByNome(dto.getNome());
            if (disciplinaComNovoNome.isPresent() && !disciplinaComNovoNome.get().getId().equals(disciplinaExistente.getId())) {
                log.warn("Tentativa de atualizar disciplina ID {} para nome duplicado: {}", id, dto.getNome());
                throw new RuntimeException("Já existe outra disciplina cadastrada com o nome: " + dto.getNome());
            }
            disciplinaExistente.setNome(dto.getNome());
            modificado = true;
        }

        if (dto.getDescricao() != null && (disciplinaExistente.getDescricao() == null || !dto.getDescricao().equals(disciplinaExistente.getDescricao()))) {
            disciplinaExistente.setDescricao(dto.getDescricao());
            modificado = true;
        }

        // if (dto.getAtiva() != null && !dto.getAtiva().equals(disciplinaExistente.getAtiva())) { // Se tiver soft delete
        //     disciplinaExistente.setAtiva(dto.getAtiva());
        //     modificado = true;
        // }

        if (modificado) {
            Disciplina disciplinaAtualizada = disciplinaRepository.save(disciplinaExistente);
            log.info("Disciplina com ID: {} atualizada com sucesso.", disciplinaAtualizada.getId());
            return toResponseDTO(disciplinaAtualizada);
        } else {
            log.info("Nenhuma alteração detectada para a disciplina com ID: {}. Retornando dados existentes.", id);
            return toResponseDTO(disciplinaExistente);
        }
    }

    @Override
    @Transactional
    public void excluir(Long id) {
        log.info("Tentando excluir disciplina com ID: {}", id);
        if (!disciplinaRepository.existsById(id)) {
            log.warn("Disciplina com ID: {} não encontrada para exclusão.", id);
            throw new RuntimeException("Disciplina com ID " + id + " não encontrada para exclusão.");
        }

        // Lógica de Negócio Adicional: Verificar se a disciplina está vinculada a turmas ou professores
        // boolean vinculadaATurma = turmaDisciplinaRepository.existsByDisciplinaId(id); // Requer método no repo
        // boolean vinculadaAProfessor = professorDisciplinaRepository.existsByDisciplinaId(id); // Requer método no repo
        // if (vinculadaATurma || vinculadaAProfessor) {
        //     log.warn("Tentativa de excluir disciplina ID {} que está vinculada a turmas ou professores.", id);
        //     throw new RuntimeException("Não é possível excluir a disciplina pois ela está vinculada a turmas ou professores.");
        // }

        disciplinaRepository.deleteById(id);
        log.info("Disciplina com ID: {} excluída com sucesso.", id);
        // Se fosse soft delete:
        // Disciplina disciplina = disciplinaRepository.findById(id).orElseThrow(...);
        // disciplina.setAtiva(false);
        // disciplinaRepository.save(disciplina);
        // log.info("Disciplina ID {} marcada como inativa.", id);
    }
}
