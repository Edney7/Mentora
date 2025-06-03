package com.example.mentora.service.usuario;

import com.example.mentora.dto.usuario.LoginRequestDTO;
import com.example.mentora.dto.usuario.UsuarioCreateDTO;
import com.example.mentora.dto.usuario.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {

    UsuarioResponseDTO cadastrar(UsuarioCreateDTO dto);

    List<UsuarioResponseDTO> listarUsuariosAtivos();
    UsuarioResponseDTO buscarUsuarioAtivoPorId(Long id);


    List<UsuarioResponseDTO> listarTodosOsUsuarios();
    UsuarioResponseDTO buscarUsuarioPorIdIncluindoInativos(Long id);


    void desativarUsuario(Long id);
    void reativarUsuario(Long id);


    UsuarioResponseDTO autenticar(LoginRequestDTO loginDTO);
    UsuarioResponseDTO toResponseDTO(com.example.mentora.model.Usuario usuario);
}
