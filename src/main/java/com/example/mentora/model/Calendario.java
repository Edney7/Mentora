package com.example.mentora.model;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "Calendario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Calendario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_calendario")
    private Long id;
}
