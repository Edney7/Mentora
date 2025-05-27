package com.example.mentora.service.presenca;

import com.example.mentora.dto.presenca.PresencaCreateDTO;
import com.example.mentora.model.Aluno;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Presenca;
import com.example.mentora.repository.AlunoRepository;
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.PresencaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PresencaService {
    @Autowired
    private PresencaRepository presencaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public Presenca registrarPresenca(PresencaCreateDTO dto){
        Aluno aluno = alunoRepository.findById(dto.getIdAluno())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));

        Disciplina disciplina = disciplinaRepository.findById(dto.getIdDisciplina())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada!"));

        Presenca presenca = new Presenca();
        presenca.setAluno(aluno);
        presenca.setDisciplina(disciplina);
        presenca.setPresente(dto.getPresente());
        presenca.setDtLancamento(dto.getDtLancamento());

        return presencaRepository.save(presenca);

    }
}
