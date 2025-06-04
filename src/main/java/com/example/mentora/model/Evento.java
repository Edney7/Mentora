package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "evento")
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private Long idEvento;

    private String titulo;
    private String descricao;
    private LocalDate data;
    private String tipo;

    @ManyToOne
    @JoinColumn(name = "idSecretaria")
    private Secretaria secretaria;

    @ManyToOne
    @JoinColumn(name = "idCalendario")
    private Calendario calendario;

    // Getters e setters
}