package com.example.mentora.service.usuario;

import com.example.mentora.dto.usuario.LoginRequestDTO;
import com.example.mentora.dto.usuario.UsuarioCreateDTO;
import com.example.mentora.dto.usuario.UsuarioResponseDTO;
import com.example.mentora.dto.usuario.UsuarioUpdateDTO;

import java.util.List;

public interface UsuarioService {

    UsuarioResponseDTO cadastrar(UsuarioCreateDTO dto);

    // Métodos existentes para ativos
    List<UsuarioResponseDTO> listarUsuariosAtivos();
    UsuarioResponseDTO buscarUsuarioAtivoPorId(Long id);

    // NOVOS MÉTODOS para buscar todos (ativos e inativos)
    List<UsuarioResponseDTO> listarTodosOsUsuarios();
    UsuarioResponseDTO buscarUsuarioPorIdIncluindoInativos(Long id);

    // Métodos para soft delete e reativação
    void desativarUsuario(Long id);
    void reativarUsuario(Long id);

    // Autenticação e conversão de DTO
    UsuarioResponseDTO autenticar(LoginRequestDTO loginDTO);
    UsuarioResponseDTO toResponseDTO(com.example.mentora.model.Usuario usuario);

    UsuarioResponseDTO atualizar(Long id, UsuarioUpdateDTO dto);
}
