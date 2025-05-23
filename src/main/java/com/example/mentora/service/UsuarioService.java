package com.example.mentora.service;

import com.example.mentora.dto.UsuarioCreateDTO;
import com.example.mentora.dto.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {
    UsuarioResponseDTO cadastrar(UsuarioCreateDTO dto);
    UsuarioResponseDTO toResponseDTO(com.example.mentora.model.Usuario usuario);
    List<UsuarioResponseDTO> listarTodos();
}
