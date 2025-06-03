package com.example.mentora.service.secretaria;

import com.example.mentora.dto.secretaria.SecretariaResponseDTO;
import com.example.mentora.model.Secretaria;
import com.example.mentora.model.Usuario; // Importar Usuario para aceder ao nome e email
import com.example.mentora.repository.SecretariaRepository;
// Considere criar exceções personalizadas, ex:
// import com.example.mentora.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SecretariaServiceImpl implements SecretariaService {

    private final SecretariaRepository secretariaRepository;

    public SecretariaServiceImpl(SecretariaRepository secretariaRepository) {
        this.secretariaRepository = secretariaRepository;
    }

    private SecretariaResponseDTO toSecretariaResponseDTO(Secretaria secretaria) {
        if (secretaria == null) {
            return null;
        }
        Usuario usuario = secretaria.getUsuario();

        return SecretariaResponseDTO.builder()
                .id(secretaria.getId())
                .idUsuario(usuario != null ? usuario.getId() : null)
                .nomeUsuario(usuario != null ? usuario.getNome() : "N/A")
                .emailUsuario(usuario != null ? usuario.getEmail() : "N/A")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SecretariaResponseDTO> listarSecretariasAtivas() {
        return secretariaRepository.findAllWhereUsuarioAtivoTrue()
                .stream()
                .map(this::toSecretariaResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SecretariaResponseDTO buscarSecretariaAtivaPorId(Long id) {
        Secretaria secretaria = secretariaRepository.findByIdAndUsuarioAtivoTrue(id)
                .orElseThrow(() -> new RuntimeException("Perfil de Secretaria ativo com ID " + id + " não encontrado, ou o utilizador associado está inativo."));
        return toSecretariaResponseDTO(secretaria);
    }

}
