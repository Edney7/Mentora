package com.example.mentora.service.aula;

import com.example.mentora.dto.aula.AulaDTO;
import com.example.mentora.model.Aula;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Professor;
import com.example.mentora.model.Turma;
import com.example.mentora.repository.AulaRepository;
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.ProfessorRepository;
import com.example.mentora.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.mentora.dto.aula.AulaResponseDTO; // Importar


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AulaServiceImpl implements AulaService{
    @Autowired
    private AulaRepository aulaRepository;
    @Autowired
    private DisciplinaRepository disciplinaRepository;
    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private TurmaRepository turmaRepository;

    // Este método vai AGORA ser usado primariamente para CRIAR a aula.
    // Ele ainda tem a lógica de "obter se existir" como uma salvaguarda para idempotência.
    @Transactional
    public Aula criarOuObterAula(AulaDTO dto) { // Renomeado para clareza
        if (dto.getDisciplinaId() == null || dto.getProfessorId() == null ||
                dto.getTurmaId() == null || dto.getDataAula() == null) {
            throw new IllegalArgumentException("Dados essenciais da aula (disciplina, professor, turma, data) são obrigatórios.");
        }

        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrada com ID: " + dto.getDisciplinaId()));
        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com ID: " + dto.getProfessorId()));
        Turma turma = turmaRepository.findById(dto.getTurmaId())
                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada com ID: " + dto.getTurmaId()));

        Optional<Aula> aulaExistente = aulaRepository.findByDisciplinaAndProfessorAndTurmaAndDataAula(
                disciplina, professor, turma, dto.getDataAula());

        if (aulaExistente.isPresent()) {
            Aula aula = aulaExistente.get();
            // Se existe, atualiza o tópico se for fornecido e diferente.
            // Isso permite que o professor registre uma aula "sem tópico" e depois adicione um.
            if (dto.getTopico() != null && !dto.getTopico().equals(aula.getTopico())) {
                aula.setTopico(dto.getTopico());
                return aulaRepository.save(aula);
            }
            return aula; // Retorna a aula existente
        } else {
            // Cria uma nova aula
            Aula novaAula = new Aula();
            novaAula.setDisciplina(disciplina);
            novaAula.setProfessor(professor);
            novaAula.setTurma(turma);
            novaAula.setDataAula(dto.getDataAula());
            novaAula.setTopico(dto.getTopico()); // Pode ser null
            return aulaRepository.save(novaAula);
        }
    }

    @Override // Mantenha esta anotação
    @Transactional(readOnly = true)
    // Mude o tipo de retorno aqui para AulaResponseDTO
    public AulaResponseDTO getAulaById(Long id) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aula não encontrada com ID: " + id));
        return toAulaResponseDTO(aula); // Use o método de conversão
    }
    // Você ainda pode manter métodos de listagem de aulas para uma tela de visualização
    // se o professor quiser ver aulas passadas.
    @Override
    @Transactional(readOnly = true)
    public List<AulaResponseDTO> listarAulasPorProfessor(Long professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com ID: " + professorId));
        List<Aula> aulas = aulaRepository.findByProfessor(professor);
        return aulas.stream()
                .map(this::toAulaResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AulaResponseDTO> listarAulasPorProfessorEDisciplinaETurma(Long professorId, Long disciplinaId, Long turmaId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com ID: " + professorId));
        Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrada com ID: " + disciplinaId));
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada com ID: " + turmaId));

        List<Aula> aulas = aulaRepository.findByProfessorAndDisciplinaAndTurma(professor, disciplina, turma);
        return aulas.stream()
                .map(this::toAulaResponseDTO) // <<<<<< CONVERTER CADA UM PARA DTO
                .collect(Collectors.toList());
    }
    private AulaResponseDTO toAulaResponseDTO(Aula aula) {
        AulaResponseDTO dto = new AulaResponseDTO();
        dto.setId(aula.getId());
        dto.setDataAula(aula.getDataAula());
        dto.setTopico(aula.getTopico());

        // Informações da Disciplina
        if (aula.getDisciplina() != null) {
            dto.setDisciplinaId(aula.getDisciplina().getId());
            dto.setNomeDisciplina(aula.getDisciplina().getNome());
            // Se precisar de mais campos da disciplina, adicione-os aqui.
        }

        // Informações do Professor
        if (aula.getProfessor() != null) {
            dto.setProfessorId(aula.getProfessor().getId());
            // Acessa o nome do professor através do Usuario associado
            if (aula.getProfessor().getUsuario() != null) {
                dto.setNomeProfessor(aula.getProfessor().getUsuario().getNome());
            } else {
                dto.setNomeProfessor("Professor desconhecido");
            }
            // Se precisar de mais campos do professor, adicione-os aqui.
        }

        // Informações da Turma
        if (aula.getTurma() != null) {
            dto.setTurmaId(aula.getTurma().getId());
            dto.setNomeTurma(aula.getTurma().getNome());
            // Se precisar de mais campos da turma, adicione-os aqui.
        }

        return dto;
    }
}
