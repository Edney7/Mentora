package com.example.mentora.dto.ausenciaprofessor;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class AusenciaProfessorResponseDTO {
    private Long id; // ID da ausência
    private LocalDate dataAusencia;
    private String motivo;
    private LocalDate dataRegistro;

    private Long professorId;
    private String nomeProfessor; // Para facilitar a visualização

    // Se tivesse um campo status na entidade:
    // private String status;
}