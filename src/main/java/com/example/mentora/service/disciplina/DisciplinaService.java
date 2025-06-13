package com.example.mentora.service.disciplina; // Ou o seu pacote de serviços

import com.example.mentora.dto.disciplina.DisciplinaCreateDTO;
import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.disciplina.DisciplinaUpdateDTO;

import java.util.List;

public interface DisciplinaService {

    DisciplinaResponseDTO cadastrar(DisciplinaCreateDTO dto);

    List<DisciplinaResponseDTO> listarTodas();

    DisciplinaResponseDTO buscarPorId(Long id);

    DisciplinaResponseDTO atualizar(Long id, DisciplinaUpdateDTO dto);

    void excluir(Long id);
}
