package com.example.mentora.dto.aula;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AulaDTO {
    // Id da aula. Útil para respostas ou para buscar uma aula existente.
    // Não é necessário para CRIAR uma nova aula via POST.
    private Long id;

    // IDs dos relacionamentos para criar a aula
    // @NotNull // Poderíamos adicionar aqui se necessário, mas o serviço já valida
    private Long disciplinaId;
    // @NotNull
    private Long professorId;
    // @NotNull
    private Long turmaId;
    // @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy", locale = "pt-BR", timezone = "America/Sao_Paulo")
    private LocalDate dataAula;

    // Detalhes adicionais (opcional)
    private String topico;
}
