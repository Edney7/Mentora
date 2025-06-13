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


    @Autowired
    public DisciplinaServiceImpl(DisciplinaRepository disciplinaRepository) {
        this.disciplinaRepository = disciplinaRepository;
    }

    private DisciplinaResponseDTO toResponseDTO(Disciplina disciplina) {
        return DisciplinaResponseDTO.builder()
                .id(disciplina.getId())
                .nome(disciplina.getNome())
                .descricao(disciplina.getDescricao())
                .build();
    }

    @Override
    @Transactional
    public DisciplinaResponseDTO cadastrar(DisciplinaCreateDTO dto) {
        log.info("Cadastrando nova disciplina: {}", dto.getNome());
        if (disciplinaRepository.existsByNome(dto.getNome())) {
            log.warn("Tentativa de cadastrar disciplina com nome duplicado: {}", dto.getNome());
            throw new RuntimeException("Já existe uma disciplina cadastrada com o nome: " + dto.getNome());
        }

        Disciplina disciplina = new Disciplina();
        disciplina.setNome(dto.getNome());
        disciplina.setDescricao(dto.getDescricao());

        Disciplina disciplinaSalva = disciplinaRepository.save(disciplina);
        log.info("Disciplina cadastrada com ID: {}", disciplinaSalva.getId());
        return toResponseDTO(disciplinaSalva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisciplinaResponseDTO> listarTodas() {
        log.info("Listando todas as disciplinas");
        return disciplinaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DisciplinaResponseDTO buscarPorId(Long id) {
        log.info("Buscando disciplina com ID: {}", id);
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Disciplina com ID: {} não encontrada.", id);
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

        disciplinaRepository.deleteById(id);
        log.info("Disciplina com ID: {} excluída com sucesso.", id);
    }
}
