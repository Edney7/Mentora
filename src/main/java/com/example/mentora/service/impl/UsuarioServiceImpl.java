package com.example.mentora.service.impl;

import com.example.mentora.dto.LoginRequestDTO;
import com.example.mentora.dto.UsuarioCreateDTO;
import com.example.mentora.dto.UsuarioResponseDTO;
import com.example.mentora.model.Usuario;
import com.example.mentora.repository.UsuarioRepository;
import com.example.mentora.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UsuarioResponseDTO cadastrar(UsuarioCreateDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setEmail(dto.getEmail());
        usuario.setSexo(dto.getSexo());
        usuario.setDtNascimento(dto.getDtNascimento());
        usuario.setTipoUsuario(dto.getTipoUsuario());

        String senhaHash = passwordEncoder.encode(dto.getSenha());
        usuario.setSenha(senhaHash);

        Usuario salvo = usuarioRepository.save(usuario);
        return toResponseDTO(salvo);
    }

    @Override
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .cpf(usuario.getCpf())
                .email(usuario.getEmail())
                .sexo(usuario.getSexo())
                .dtNascimento(usuario.getDtNascimento())
                .tipoUsuario(usuario.getTipoUsuario())
                .build();
    }

    @Override
    public UsuarioResponseDTO autenticar(LoginRequestDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou Senha inválida"));

        if (!passwordEncoder.matches(loginDTO.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Email ou Senha inválida");
        }

        return toResponseDTO(usuario);
    }

}
