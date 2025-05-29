package com.example.mentora.model; // Ou o seu pacote de modelo

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank; // Para validação a nível de entidade, se desejar
import jakarta.validation.constraints.Size;    // Para validação a nível de entidade
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor; // Construtor padrão para JPA
import lombok.AllArgsConstructor; // Construtor com todos os argumentos (opcional)

@Getter
@Setter
@NoArgsConstructor // JPA requer um construtor sem argumentos
@AllArgsConstructor // Opcional, pode ser útil
@Entity
@Table(name = "disciplina", uniqueConstraints = { // Garante que o nome da disciplina seja único
        @UniqueConstraint(columnNames = "nome", name = "uk_disciplina_nome")
})
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "O nome da disciplina não pode ser vazio.") // Validação a nível de DTO é mais comum para entrada
    @Size(max = 100, message = "O nome da disciplina não pode exceder 100 caracteres.")
    @Column(name = "nome", nullable = false, unique = true, length = 100)
    private String nome;

    @Size(max = 1000, message = "A descrição não pode exceder 1000 caracteres.")
    @Column(name = "descricao", columnDefinition = "TEXT") // TEXT para descrições mais longas
    private String descricao; // Descrição é opcional

    // Se precisar de um campo 'ativo' para soft delete de disciplinas:
    // @Column(name = "ativa", nullable = false)
    // private Boolean ativa = true;

    // Construtores, getters e setters são gerenciados pelo Lombok
    // Se não usar @AllArgsConstructor, pode criar um construtor para nome e descrição, por exemplo:
    // public Disciplina(String nome, String descricao) {
    //     this.nome = nome;
    //     this.descricao = descricao;
    // }
}
