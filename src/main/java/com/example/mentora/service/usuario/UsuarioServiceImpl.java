package com.example.mentora.service.usuario;

import com.example.mentora.dto.usuario.LoginRequestDTO;
import com.example.mentora.dto.usuario.UsuarioCreateDTO;
import com.example.mentora.dto.usuario.UsuarioResponseDTO;
import com.example.mentora.enums.TipoUsuario;
import com.example.mentora.model.Aluno;
import com.example.mentora.model.Turma;
import com.example.mentora.model.Usuario;
import com.example.mentora.repository.AlunoRepository;
import com.example.mentora.repository.TurmaRepository;
import com.example.mentora.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder,
                              AlunoRepository alunoRepository,
                              TurmaRepository turmaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.alunoRepository = alunoRepository;
        this.turmaRepository = turmaRepository;
    }

    @Override
    @Transactional
    public UsuarioResponseDTO cadastrar(UsuarioCreateDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado.");
        }
        if (usuarioRepository.existsByCpf(dto.getCpf())) {
            throw new RuntimeException("CPF já cadastrado.");
        }
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setEmail(dto.getEmail());
        usuario.setSexo(dto.getSexo());
        // Corrigido para usar o setter correspondente ao campo 'dataNascimento' na entidade Usuario,
        // assumindo que UsuarioCreateDTO ainda usa 'dtNascimento'.
        usuario.setDataNascimento(dto.getDtNascimento()); // Assumindo que Usuario.java tem setDataNascimento()

        TipoUsuario tipo;
        try {
            tipo = TipoUsuario.valueOf(dto.getTipoUsuario().toUpperCase());
            usuario.setTipoUsuario(tipo);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Tipo de usuário inválido. Use: ALUNO, PROFESSOR ou SECRETARIA.");
        }

        usuario.setSenha(passwordEncoder.encode(dto.getSenha())); // Assumindo Usuario.java tem setSenha()
        usuario.setAtivo(true);

        Usuario salvo = usuarioRepository.save(usuario);
        // A linha de debug abaixo foi útil e pode ser mantida ou removida conforme necessário.
        System.out.println("DEBUG: ID do Usuario salvo: " + (salvo != null ? salvo.getId() : "salvo é null ou ID é null"));

        if (tipo == TipoUsuario.ALUNO) {
            if (dto.getTurmaId() == null) {
                throw new RuntimeException("turmaId é obrigatório para cadastrar um ALUNO.");
            }
            Turma turma = turmaRepository.findById(dto.getTurmaId())
                    .orElseThrow(() -> new RuntimeException("Turma com ID " + dto.getTurmaId() + " não encontrada."));

            Aluno aluno = new Aluno();
            aluno.setUsuario(salvo);
            aluno.setTurma(turma);
            alunoRepository.save(aluno);
        }

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
                // Corrigido para usar o getter correspondente ao campo 'dataNascimento' na entidade Usuario,
                // assumindo que UsuarioResponseDTO ainda espera 'dtNascimento'.
                .dtNascimento(usuario.getDataNascimento()) // Assumindo que Usuario.java tem getDataNascimento()
                .tipoUsuario(usuario.getTipoUsuario())
                .build();
    }

    @Override
    public UsuarioResponseDTO autenticar(LoginRequestDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou Senha inválida"));

        // Assumindo que Usuario.java tem getSenha()
        if (!passwordEncoder.matches(loginDTO.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Email ou Senha inválida");
        }

        return toResponseDTO(usuario);
    }
}
