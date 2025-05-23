package com.example.mentora.service.usuario;

import com.example.mentora.dto.usuario.LoginRequestDTO;
import com.example.mentora.dto.usuario.UsuarioCreateDTO;
import com.example.mentora.dto.usuario.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {
    UsuarioResponseDTO cadastrar(UsuarioCreateDTO dto);
    UsuarioResponseDTO toResponseDTO(com.example.mentora.model.Usuario usuario);
    List<UsuarioResponseDTO> listarTodos();
    UsuarioResponseDTO autenticar(LoginRequestDTO loginDTO);

}
