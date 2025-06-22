package com.example.mentora.service.aula;
import com.example.mentora.dto.aula.AulaDTO;
import com.example.mentora.model.Aula;
import java.util.List;
import com.example.mentora.dto.aula.AulaResponseDTO; // Importar

import java.time.LocalDate;
public interface AulaService {

    Aula criarOuObterAula(AulaDTO dto);


    AulaResponseDTO getAulaById(Long id);


    List<AulaResponseDTO> listarAulasPorProfessor(Long professorId);


    List<AulaResponseDTO> listarAulasPorProfessorEDisciplinaETurma(Long professorId, Long disciplinaId, Long turmaId);

}
