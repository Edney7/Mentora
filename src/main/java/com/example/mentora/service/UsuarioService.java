package com.example.mentora.service;

import com.example.mentora.dto.UsuarioCreateDTO;
import com.example.mentora.dto.UsuarioResponseDTO;
import com.example.mentora.model.Usuario;
import com.example.mentora.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public UsuarioResponseDTO cadastrar(UsuarioCreateDTO dto) {
        // Validação de regra de negócio
        if (repository.existsByCpf(dto.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        if (repository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        // Conversão DTO -> Entidade
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setEmail(dto.getEmail());
        usuario.setSexo(dto.getSexo());
        usuario.setDtNascimento(dto.getDtNascimento());
        usuario.setTipoUsuario(dto.getTipoUsuario());
        usuario.setSenha(dto.getSenha()); // futuramente você pode criptografar aqui

        Usuario salvo = repository.save(usuario);

        return toResponseDTO(salvo);
    }

    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setCpf(usuario.getCpf());
        dto.setEmail(usuario.getEmail());
        dto.setSexo(usuario.getSexo());
        dto.setDtNascimento(usuario.getDtNascimento());
        dto.setTipoUsuario(usuario.getTipoUsuario());
        return dto;
    }
}

