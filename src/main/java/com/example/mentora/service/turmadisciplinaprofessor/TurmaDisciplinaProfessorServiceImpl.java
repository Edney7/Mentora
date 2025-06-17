package com.example.mentora.service.turmadisciplinaprofessor;

import com.example.mentora.dto.turmadisciplinaprofessor.TurmaDisciplinaProfessorResponseDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Professor;
import com.example.mentora.model.Turma;
import com.example.mentora.model.TurmaDisciplinaProfessor;
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.ProfessorRepository;
import com.example.mentora.repository.TurmaDisciplinaProfessorRepository;
import com.example.mentora.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TurmaDisciplinaProfessorServiceImpl implements TurmaDisciplinaProfessorService {
    @Autowired
    private TurmaDisciplinaProfessorRepository TurmaDisciplinaProfessorRepository; // Repositório da sua nova entidade
    @Autowired
    private TurmaRepository turmaRepository; // Para buscar a entidade Turma
    @Autowired
    private DisciplinaRepository disciplinaRepository; // Para buscar a entidade Disciplina
    @Autowired
    private ProfessorRepository professorRepository; // Para buscar a entidade Professor

    @Override
    @Transactional // Garante que a operação seja atômica
    public void associar(Long turmaId, Long disciplinaId, Long professorId) {
        // 1. Verificar se a associação já existe para evitar duplicatas (opcional, mas recomendado)
        boolean exists = TurmaDisciplinaProfessorRepository.findByTurmaIdAndDisciplinaId(turmaId, disciplinaId).isPresent();
        if (exists) {
            // Poderia lançar uma exceção ou simplesmente ignorar se a associação já existe
            throw new RuntimeException("Disciplina já possui professor associado a esta turma.");
        }

        // 2. Buscar as entidades completas do banco de dados
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada com ID: " + disciplinaId));
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + professorId));

        // 3. Criar a nova entidade de associação
        TurmaDisciplinaProfessor novaTurmaDisciplinaProfessor = new TurmaDisciplinaProfessor();
        novaTurmaDisciplinaProfessor.setTurma(turma);
        novaTurmaDisciplinaProfessor.setDisciplina(disciplina);
        novaTurmaDisciplinaProfessor.setProfessor(professor);

        // 4. Salvar no banco de dados
        TurmaDisciplinaProfessorRepository.save(novaTurmaDisciplinaProfessor);
    }

    @Override
    @Transactional(readOnly = true) // Otimiza para leitura
    public List<TurmaDisciplinaProfessorResponseDTO> listarPorTurma(Long turmaId) {
        // 1. Buscar todas as associações para a turma específica
        List<TurmaDisciplinaProfessor> ofertas = TurmaDisciplinaProfessorRepository.findByTurmaId(turmaId);// Crie este método no seu repositório

        // 2. Mapear as entidades para DTOs de resposta
        return ofertas.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Método auxiliar para converter a entidade para o DTO
    private TurmaDisciplinaProfessorResponseDTO convertToDto(TurmaDisciplinaProfessor entity) {
        TurmaDisciplinaProfessorResponseDTO dto = new TurmaDisciplinaProfessorResponseDTO();
        dto.setId(entity.getId());
        dto.setDisciplinaId(entity.getDisciplina().getId());
        dto.setNomeDisciplina(entity.getDisciplina().getNome());
        dto.setProfessorId(entity.getProfessor().getId());
        dto.setNomeProfessor(entity.getProfessor().getUsuario().getNome()); // ou getNome(), dependendo do campo do professor
        return dto;
    }
    @Override
    public List<TurmaResponseDTO> listarTurmasPorProfessor(Long professorId) {
        List<TurmaDisciplinaProfessor> vinculacoes =
                TurmaDisciplinaProfessorRepository.findByProfessorId(professorId);

        return vinculacoes.stream()
                .map(v -> {
                    var turma = v.getTurma();
                    return TurmaResponseDTO.builder()
                            .id(turma.getId())
                            .nome(turma.getNome())
                            .turno(turma.getTurno())
                            .serieAno(turma.getSerieAno())
                            .anoLetivo(turma.getAnoLetivo())
                            .build();
                })
                .distinct() // para evitar turmas duplicadas
                .collect(Collectors.toList());
    }
}
