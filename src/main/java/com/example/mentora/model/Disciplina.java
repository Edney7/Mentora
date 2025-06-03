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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "disciplina", uniqueConstraints = {
        @UniqueConstraint(columnNames = "nome", name = "uk_disciplina_nome")
})
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "O nome da disciplina não pode ser vazio.")
    @Size(max = 100, message = "O nome da disciplina não pode exceder 100 caracteres.")
    @Column(name = "nome", nullable = false, unique = true, length = 100)
    private String nome;

    @Size(max = 1000, message = "A descrição não pode exceder 1000 caracteres.")
    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

}
