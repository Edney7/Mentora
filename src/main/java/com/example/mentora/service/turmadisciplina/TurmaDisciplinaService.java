package com.example.mentora.service.turmadisciplina; // Certifique-se que o pacote está correto

import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.turmadisciplina.AtualizarDisciplinasTurmaRequestDTO;
import com.example.mentora.dto.turmadisciplina.VincularDisciplinaTurmaRequestDTO;
import java.util.List;

public interface TurmaDisciplinaService {
    void vincularDisciplina(VincularDisciplinaTurmaRequestDTO dto);
    void desvincularDisciplina(Long turmaId, Long disciplinaId);
    void atualizarDisciplinasDaTurma(AtualizarDisciplinasTurmaRequestDTO dto);
    List<DisciplinaResponseDTO> listarDisciplinasPorTurma(Long turmaId); // <-- O MÉTODO DEVE ESTAR AQUI
}