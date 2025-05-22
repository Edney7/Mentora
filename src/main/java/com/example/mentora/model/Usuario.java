//package com.example.mentora.model;
//
//import jakarta.persistence.*;
//
//import java.time.LocalDate;
//
//@Entity
//@Table(name="Usuario")
//
//public class Usuario {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name="id_usuario")
//    private Long id;
//
//    @Column(nullable = false)
//    private String nome;
//
//    @Column(nullable = false, unique = true, length = 14)
//    private String cpf;
//
//    @Column(nullable = false, unique = false, length = 100)
//    private String email;
//
//    private String sexo;
//    private LocalDate dtNascimento;
//
//    @Column(name = "tipo")
//    private String tipoUsuario; //Aluno, Professor ou Funcionário da secretaria
//
//    @Column(nullable = false, length = 255)
//    private String senha;
//
//    public Long getId() {
//        return id;
//    }
//
//    public String getNome() {
//        return nome;
//    }
//
//    public String getCpf() {
//        return cpf;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public String getSexo() {
//        return sexo;
//    }
//
//    public LocalDate getDtNascimento() {
//        return dtNascimento;
//    }
//
//    public String getTipoUsuario() {
//        return tipoUsuario;
//    }
//
//    public String getSenha() {
//        return senha;
//    }
//
//    // Setters
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public void setNome(String nome) {
//        this.nome = nome;
//    }
//
//    public void setCpf(String cpf) {
//        this.cpf = cpf;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public void setSexo(String sexo) {
//        this.sexo = sexo;
//    }
//
//    public void setDtNascimento(LocalDate dtNascimento) {
//        this.dtNascimento = dtNascimento;
//    }
//
//    public void setTipoUsuario(String tipoUsuario) {
//        this.tipoUsuario = tipoUsuario;
//    }
//
//    public void setSenha(String senha) {
//        this.senha = senha;
//    }
//}




package com.example.mentora.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "Usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "Cpf é obrigatório")
    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Column(nullable = false, unique = true, length = 100) // corrigido aqui
    private String email;

    @NotBlank(message = "Sexo é obrigatório")
    @Column(nullable = false)
    private String sexo;

    @NotNull(message = "Data de nascimento é obrigatória")
    @PastOrPresent(message = "Data deve ser no passado ou presente")
    @Column(nullable = false)
    private LocalDate dtNascimento;

    @NotBlank(message = "Tipo é obrigatório")
    @Column(name = "tipo")
    private String tipoUsuario;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no minimo 6 caracteres")
    @Column(nullable = false)
    private String senha;

}
