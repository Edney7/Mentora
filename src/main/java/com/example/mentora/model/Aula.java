package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity // Indica que é uma entidade JPA e será mapeada para uma tabela no banco
@Data // Anotação Lombok para gerar automaticamente getters, setters, etc.
@NoArgsConstructor // Construtor sem argumentos
@AllArgsConstructor // Construtor com todos os argumentos
@Table(name = "aulas") // Opcional: define o nome da tabela no banco de dados (por padrão seria 'aula')
public class Aula {

    @Id // Marca o campo como chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Estratégia para geração automática de ID
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Relacionamento muitos para um com Disciplina
    @JoinColumn(name = "disciplina_id", nullable = false) // Coluna da chave estrangeira e indica que não pode ser nula
    private Disciplina disciplina; // Referência à disciplina a que esta aula pertence

    @ManyToOne(fetch = FetchType.LAZY) // Relacionamento muitos para um com Turma
    @JoinColumn(name = "turma_id", nullable = false) // Coluna da chave estrangeira e não nula
    private Turma turma; // Referência à turma que teve esta aula (CRUCIAL para filtrar aulas por turma)

    @ManyToOne(fetch = FetchType.LAZY) // Relacionamento muitos para um com Professor
    @JoinColumn(name = "professor_id", nullable = false) // Coluna da chave estrangeira e não nula
    private Professor professor; // O professor que ministrou esta aula específica

    @Column(nullable = false) // Indica que a coluna não pode ser nula no banco de dados
    private LocalDate dataAula; // A data específica em que esta aula ocorreu

    @Column(length = 255) // Opcional: Define o tamanho máximo da string
    private String topico; // Opcional: Um breve tópico ou descrição do conteúdo da aula (ex: "Introdução à Álgebra")

    // Você pode considerar adicionar campos de hora se as aulas tiverem horários específicos no dia:
    // private LocalTime horaInicio;
    // private LocalTime horaFim;
}