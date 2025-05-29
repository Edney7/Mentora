package com.example.mentora.service.professordisciplina;

import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.professor.ProfessorResponseDTO; // Importar o DTO correto
import com.example.mentora.dto.professordisciplina.AtualizarDisciplinasProfessorRequestDTO;
import com.example.mentora.dto.professordisciplina.VincularDisciplinaProfessorRequestDTO;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Professor;
import com.example.mentora.model.ProfessorDisciplina;
import com.example.mentora.model.ProfessorDisciplinaId;
import com.example.mentora.model.Usuario; // Necessário para obter nome do usuário
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.ProfessorDisciplinaRepository;
import com.example.mentora.repository.ProfessorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorDisciplinaServiceImpl implements ProfessorDisciplinaService {

    private static final Logger log = LoggerFactory.getLogger(ProfessorDisciplinaServiceImpl.class);

    private final ProfessorDisciplinaRepository professorDisciplinaRepository;
    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;

    @Autowired
    public ProfessorDisciplinaServiceImpl(ProfessorDisciplinaRepository professorDisciplinaRepository,
                                          ProfessorRepository professorRepository,
                                          DisciplinaRepository disciplinaRepository) {
        this.professorDisciplinaRepository = professorDisciplinaRepository;
        this.professorRepository = professorRepository;
        this.disciplinaRepository = disciplinaRepository;
    }

    // ... (métodos vincularDisciplinaAoProfessor, desvincularDisciplinaDoProfessor, atualizarDisciplinasDoProfessor, listarDisciplinasPorProfessor permanecem os mesmos)

    @Override
    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> listarProfessoresPorDisciplina(Long disciplinaId) {
        log.debug("Listando professores para a disciplina ID {}", disciplinaId);

        if (!disciplinaRepository.existsById(disciplinaId)) {
            log.warn("Tentativa de listar professores para disciplina ID {} não encontrada.", disciplinaId);
            throw new RuntimeException("Disciplina com ID " + disciplinaId + " não encontrada.");
        }

        List<ProfessorDisciplina> associacoes = professorDisciplinaRepository.findByDisciplinaId(disciplinaId);
        log.debug("Encontrados {} professores associados à disciplina ID {}", associacoes.size(), disciplinaId);

        return associacoes.stream()
                .map(ProfessorDisciplina::getProfessor)
                .map(this::toProfessorResponseDTO) // Alterado para usar o DTO completo
                .collect(Collectors.toList());
    }

    // Método auxiliar para converter Disciplina para DisciplinaResponseDTO (já existente)
    private DisciplinaResponseDTO toDisciplinaResponseDTO(Disciplina disciplina) {
        return DisciplinaResponseDTO.builder()
                .id(disciplina.getId())
                .nome(disciplina.getNome())
                .descricao(disciplina.getDescricao())
                .build();
    }

    // NOVO/ATUALIZADO: Método auxiliar para converter Professor para ProfessorResponseDTO
    private ProfessorResponseDTO toProfessorResponseDTO(Professor professor) {
        if (professor == null) {
            log.warn("Tentativa de converter um Professor nulo para ProfessorResponseDTO.");
            // Pode retornar null ou um DTO com valores padrão/indicativos de erro
            return null;
        }
        Usuario usuario = professor.getUsuario();
        if (usuario == null) {
            log.warn("Professor com ID {} não possui um Usuário associado ao converter para DTO.", professor.getId());
            // Pode retornar um DTO com informações parciais ou lançar uma exceção
            return ProfessorResponseDTO.builder()
                    .id(professor.getId())
                    .idUsuario(null) // Usuário não encontrado
                    .nomeUsuario("Usuário não associado")
                    .build();
        }
        return ProfessorResponseDTO.builder()
                .id(professor.getId())
                .idUsuario(usuario.getId())
                .nomeUsuario(usuario.getNome())
                .build();
    }

    // Implementação dos outros métodos da interface...
    @Override
    @Transactional
    public void vincularDisciplinaAoProfessor(VincularDisciplinaProfessorRequestDTO dto) {
        log.info("Tentando vincular disciplina ID {} ao professor ID {}", dto.getDisciplinaId(), dto.getProfessorId());
        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> {
                    log.warn("Professor com ID {} não encontrado para vinculação.", dto.getProfessorId());
                    return new RuntimeException("Professor com ID " + dto.getProfessorId() + " não encontrado.");
                });
        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> {
                    log.warn("Disciplina com ID {} não encontrada para vinculação.", dto.getDisciplinaId());
                    return new RuntimeException("Disciplina com ID " + dto.getDisciplinaId() + " não encontrada.");
                });
        ProfessorDisciplinaId professorDisciplinaId = new ProfessorDisciplinaId(professor.getId(), disciplina.getId());
        if (professorDisciplinaRepository.existsById(professorDisciplinaId)) {
            log.warn("Disciplina ID {} já está vinculada ao Professor ID {}", disciplina.getId(), professor.getId());
            throw new RuntimeException("Disciplina ID " + disciplina.getId() + " já está vinculada ao Professor ID " + professor.getId());
        }
        ProfessorDisciplina professorDisciplina = new ProfessorDisciplina(professor, disciplina);
        professorDisciplinaRepository.save(professorDisciplina);
        log.info("Disciplina ID {} vinculada com sucesso ao Professor ID {}", disciplina.getId(), professor.getId());
    }

    @Override
    @Transactional
    public void desvincularDisciplinaDoProfessor(Long professorId, Long disciplinaId) {
        log.info("Tentando desvincular disciplina ID {} do professor ID {}", disciplinaId, professorId);
        ProfessorDisciplinaId professorDisciplinaId = new ProfessorDisciplinaId(professorId, disciplinaId);
        if (!professorDisciplinaRepository.existsById(professorDisciplinaId)) {
            log.warn("Vínculo entre Professor ID {} e Disciplina ID {} não encontrado para desvinculação.", professorId, disciplinaId);
            throw new RuntimeException("Vínculo entre Professor ID " + professorId + " e Disciplina ID " + disciplinaId + " não encontrado.");
        }
        professorDisciplinaRepository.deleteById(professorDisciplinaId);
        log.info("Disciplina ID {} desvinculada com sucesso do Professor ID {}", disciplinaId, professorId);
    }

    @Override
    @Transactional
    public void atualizarDisciplinasDoProfessor(AtualizarDisciplinasProfessorRequestDTO dto) {
        log.info("Atualizando disciplinas para o professor ID {}", dto.getProfessorId());
        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> {
                    log.warn("Professor com ID {} não encontrado para atualização de disciplinas.", dto.getProfessorId());
                    return new RuntimeException("Professor com ID " + dto.getProfessorId() + " não encontrado.");
                });
        log.debug("Removendo associações antigas de disciplinas para o professor ID {}", professor.getId());
        professorDisciplinaRepository.deleteByProfessorId(professor.getId());
        if (dto.getDisciplinaIds() != null && !dto.getDisciplinaIds().isEmpty()) {
            log.debug("Adicionando {} novas associações de disciplinas para o professor ID {}", dto.getDisciplinaIds().size(), professor.getId());
            for (Long disciplinaId : dto.getDisciplinaIds()) {
                Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                        .orElseThrow(() -> {
                            log.error("Disciplina com ID {} não encontrada ao tentar vincular ao professor ID {}.", disciplinaId, professor.getId());
                            return new RuntimeException("Disciplina com ID " + disciplinaId + " não encontrada.");
                        });
                ProfessorDisciplina novaAssociacao = new ProfessorDisciplina(professor, disciplina);
                professorDisciplinaRepository.save(novaAssociacao);
                log.info("Disciplina ID {} vinculada ao Professor ID {}", disciplinaId, professor.getId());
            }
        } else {
            log.info("Nenhuma disciplina fornecida para vincular ao Professor ID {}. Todas as associações anteriores foram removidas.", professor.getId());
        }
        log.info("Disciplinas atualizadas com sucesso para o Professor ID {}", professor.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisciplinaResponseDTO> listarDisciplinasPorProfessor(Long professorId) {
        log.debug("Listando disciplinas para o professor ID {}", professorId);
        if (!professorRepository.existsById(professorId)) {
            log.warn("Tentativa de listar disciplinas para professor ID {} não encontrado.", professorId);
            throw new RuntimeException("Professor com ID " + professorId + " não encontrado.");
        }
        List<ProfessorDisciplina> associacoes = professorDisciplinaRepository.findByProfessorId(professorId);
        log.debug("Encontradas {} associações de disciplina para o professor ID {}", associacoes.size(), professorId);
        return associacoes.stream()
                .map(ProfessorDisciplina::getDisciplina)
                .map(this::toDisciplinaResponseDTO)
                .collect(Collectors.toList());
    }
}
