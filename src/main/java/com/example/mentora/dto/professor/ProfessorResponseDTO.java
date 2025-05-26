package com.example.mentora.dto.professor;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProfessorResponseDTO {
    private Long id;
    private Long idUsuario;
    private String nomeUsuario;
}
