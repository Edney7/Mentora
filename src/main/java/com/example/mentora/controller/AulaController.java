package com.example.mentora.controller;


import com.example.mentora.dto.aula.AulaDTO;
import com.example.mentora.model.Aula;

import com.example.mentora.service.aula.AulaService;
import com.example.mentora.dto.aula.AulaResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aulas")
public class AulaController {
    @Autowired
    private AulaService aulaService;

    /**
     * Endpoint para CRIAR UMA AULA.
     * O professor enviará disciplinaId, turmaId, professorId e dataAula (e opcionalmente tópico).
     * Se uma aula com esses critérios já existir, ela será retornada. Caso contrário, uma nova será criada.
     * Retorna a Aula (com seu ID) para que o frontend possa usá-lo para registrar faltas.
     */
    @PostMapping
    public ResponseEntity<AulaResponseDTO> criarAula(@RequestBody AulaDTO aulaDTO) {
        try {
            // Este método ainda retorna a entidade Aula para o serviço
            // porque é onde a lógica de negócio opera sobre as entidades.
            Aula aulaCriadaOuExistente = aulaService.criarOuObterAula(aulaDTO);

            // Converta a entidade Aula para AulaResponseDTO antes de retornar
            AulaResponseDTO responseDTO = toAulaResponseDTO(aulaCriadaOuExistente); // Usar método auxiliar

            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // Logar o erro completo para depuração
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AulaResponseDTO> getAulaById(@PathVariable Long id) { // Retorna DTO
        try {
            AulaResponseDTO aula = aulaService.getAulaById(id); // Serviço já retorna DTO
            return new ResponseEntity<>(aula, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    // Manter endpoints de listagem de aulas se necessário para outras telas.
    // Ex: para o professor visualizar um histórico de aulas.
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<AulaResponseDTO>> listarAulasPorProfessor(@PathVariable Long professorId) { // Retorna lista de DTOs
        try {
            List<AulaResponseDTO> aulas = aulaService.listarAulasPorProfessor(professorId); // Serviço já retorna DTOs
            if (aulas.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(aulas, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/professor/{professorId}/disciplina/{disciplinaId}/turma/{turmaId}")
    public ResponseEntity<List<AulaResponseDTO>> listarAulasPorProfessorEDisciplinaETurma( // Retorna lista de DTOs
                                                                                           @PathVariable Long professorId,
                                                                                           @PathVariable Long disciplinaId,
                                                                                           @PathVariable Long turmaId) {
        try {
            List<AulaResponseDTO> aulas = aulaService.listarAulasPorProfessorEDisciplinaETurma(professorId, disciplinaId, turmaId); // Serviço já retorna DTOs
            if (aulas.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(aulas, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // Método auxiliar para converter Aula para AulaResponseDTO no controller
    // Se o serviço já retorna DTO, este método pode ser redundante aqui,
    // mas é útil se você ainda precisa retornar a entidade Aula do serviço em alguns casos.
    private AulaResponseDTO toAulaResponseDTO(Aula aula) {
        AulaResponseDTO dto = new AulaResponseDTO();
        dto.setId(aula.getId());
        dto.setDataAula(aula.getDataAula());
        dto.setTopico(aula.getTopico());

        if (aula.getDisciplina() != null) {
            dto.setDisciplinaId(aula.getDisciplina().getId());
            dto.setNomeDisciplina(aula.getDisciplina().getNome());
        }

        if (aula.getProfessor() != null) {
            dto.setProfessorId(aula.getProfessor().getId());
            if (aula.getProfessor().getUsuario() != null) {
                dto.setNomeProfessor(aula.getProfessor().getUsuario().getNome());
            }
        }

        if (aula.getTurma() != null) {
            dto.setTurmaId(aula.getTurma().getId());
            dto.setNomeTurma(aula.getTurma().getNome());
        }
        return dto;
    }
}
