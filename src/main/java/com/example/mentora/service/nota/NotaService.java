package com.example.mentora.service.nota; // Ou o seu pacote de serviços

import com.example.mentora.dto.nota.NotaCreateDTO;
import com.example.mentora.dto.nota.NotaResponseDTO;
import com.example.mentora.dto.nota.NotaUpdateDTO; // Importar se for adicionar método de atualização

import java.util.List;

public interface NotaService {

    NotaResponseDTO lancarNota(NotaCreateDTO dto);

    NotaResponseDTO buscarNotaPorId(Long id);

    List<NotaResponseDTO> listarNotasPorAluno(Long alunoId);

    List<NotaResponseDTO> listarNotasPorAlunoEDisciplina(Long alunoId, Long disciplinaId);

    List<NotaResponseDTO> listarTodasNotas();

}
