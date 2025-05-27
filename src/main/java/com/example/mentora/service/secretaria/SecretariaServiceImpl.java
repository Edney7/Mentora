package com.example.mentora.service.secretaria;

import com.example.mentora.dto.secretaria.SecretariaResponseDTO;
import com.example.mentora.model.Secretaria;
import com.example.mentora.repository.SecretariaRepository;
// UsuarioRepository não é mais necessário aqui se o cadastro foi removido
// e o toResponseDTO já acessa o usuário através da entidade Secretaria.
// import com.example.mentora.repository.UsuarioRepository;

// Considere criar exceções customizadas, ex:
// import com.example.mentora.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SecretariaServiceImpl implements SecretariaService {

    private final SecretariaRepository secretariaRepository;
    // private final UsuarioRepository usuarioRepository; // Removido se não usado diretamente

    public SecretariaServiceImpl(SecretariaRepository secretariaRepository
            /*, UsuarioRepository usuarioRepository */) {
        this.secretariaRepository = secretariaRepository;
        // this.usuarioRepository = usuarioRepository;
    }

    // O método cadastrar(SecretariaCreateDTO dto) foi removido.

    @Override
    @Transactional(readOnly = true)
    public List<SecretariaResponseDTO> listarTodos() {
        return secretariaRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SecretariaResponseDTO buscarPorId(Long id) {
        Secretaria secretaria = secretariaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de Secretaria com ID " + id + " não encontrado.")); // Usar ResourceNotFoundException
        return toResponseDTO(secretaria);
    }

    private SecretariaResponseDTO toResponseDTO(Secretaria secretaria) {
        if (secretaria == null) {
            return null;
        }
        // O getUsuario() não deve ser nulo devido à restrição na entidade Secretaria
        return SecretariaResponseDTO.builder()
                .id(secretaria.getId())
                .idUsuario(secretaria.getUsuario().getId())
                .nomeUsuario(secretaria.getUsuario().getNome())
                .emailUsuario(secretaria.getUsuario().getEmail())
                .build();
    }

    // Implementar outros métodos da interface SecretariaService se adicionados (atualizar, deletar)
}
