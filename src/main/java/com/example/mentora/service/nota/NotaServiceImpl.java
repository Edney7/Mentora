package com.example.mentora.service.nota;

import com.example.mentora.dto.nota.NotaCreateDTO;
import com.example.mentora.dto.nota.NotaResponseDTO;
import com.example.mentora.model.Aluno;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Nota;
import com.example.mentora.repository.AlunoRepository;
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotaServiceImpl implements NotaService {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Override
    public NotaResponseDTO cadastrar(NotaCreateDTO dto) {
        Aluno aluno = alunoRepository.findById(dto.getIdAluno())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Disciplina disciplina = disciplinaRepository.findById(dto.getIdDisciplina())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        Nota nota = new Nota();
        nota.setValor(dto.getValor());
        nota.setDtLancamento(dto.getDtLancamento());
        nota.setAluno(aluno);
        nota.setDisciplina(disciplina);

        Nota salva = notaRepository.save(nota);

        return NotaResponseDTO.builder()
                .id(salva.getId())
                .valor(salva.getValor())
                .dtLancamento(salva.getDtLancamento())
                .idAluno(salva.getAluno().getId())
                .idDisciplina(salva.getDisciplina().getId())
                .build();
    }

    @Override
    public List<NotaResponseDTO> listar() {
        return notaRepository.findAll().stream().map(nota ->
                NotaResponseDTO.builder()
                        .id(nota.getId())
                        .valor(nota.getValor())
                        .dtLancamento(nota.getDtLancamento())
                        .idAluno(nota.getAluno().getId())
                        .idDisciplina(nota.getDisciplina().getId())
                        .build()
        ).collect(Collectors.toList());
    }
}
