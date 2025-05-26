package com.example.mentora.service.secretaria;

import com.example.mentora.dto.secretaria.SecretariaCreateDTO;
import com.example.mentora.dto.secretaria.SecretariaResponseDTO;
import com.example.mentora.model.Secretaria;
import com.example.mentora.model.Usuario;
import com.example.mentora.repository.SecretariaRepository;
import com.example.mentora.repository.UsuarioRepository;
import com.example.mentora.service.secretaria.SecretariaService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SecretariaServiceImpl implements SecretariaService {

    private final SecretariaRepository secretariaRepository;
    private final UsuarioRepository usuarioRepository;

    public SecretariaServiceImpl(SecretariaRepository secretariaRepository, UsuarioRepository usuarioRepository) {
        this.secretariaRepository = secretariaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public SecretariaResponseDTO cadastrar(SecretariaCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Secretaria secretaria = new Secretaria();
        secretaria.setUsuario(usuario);

        Secretaria salva = secretariaRepository.save(secretaria);
        return toResponseDTO(salva);
    }

    @Override
    public List<SecretariaResponseDTO> listarTodos() {
        return secretariaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private SecretariaResponseDTO toResponseDTO(Secretaria secretaria) {
        return SecretariaResponseDTO.builder()
                .id(secretaria.getId())
                .idUsuario(secretaria.getUsuario().getId())
                .nomeUsuario(secretaria.getUsuario().getNome())
                .emailUsuario(secretaria.getUsuario().getEmail())
                .build();
    }
}
