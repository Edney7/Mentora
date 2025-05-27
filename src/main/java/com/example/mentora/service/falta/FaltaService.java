package com.example.mentora.service.falta;

import com.example.mentora.dto.falta.FaltaCreateDTO;
import com.example.mentora.model.Aluno;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Falta;
import com.example.mentora.repository.AlunoRepository;
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.FaltaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FaltaService {
    @Autowired
    private FaltaRepository faltaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public Falta registraFalta(FaltaCreateDTO dto) {
        Aluno aluno = alunoRepository.findById(dto.getIdAluno())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));

        Disciplina disciplina = disciplinaRepository.findById(dto.getIdDisciplina())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada!"));

        Falta falta = new Falta();
        falta.setAluno(aluno);
        falta.setDisciplina(disciplina);
        falta.setJustificada(dto.getJustificada());
        falta.setDataFalta(dto.getDataFalta());

        if (dto.getDescricaoJustificativa() != null) {
            falta.setDescricaoJustificativa(dto.getDescricaoJustificativa());
        }

        return faltaRepository.save(falta);
    }
}
