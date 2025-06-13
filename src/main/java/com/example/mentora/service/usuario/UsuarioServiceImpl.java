package com.example.mentora.service.usuario;

import com.example.mentora.dto.usuario.LoginRequestDTO;
import com.example.mentora.dto.usuario.UsuarioCreateDTO;
import com.example.mentora.dto.usuario.UsuarioResponseDTO;
import com.example.mentora.dto.usuario.UsuarioUpdateDTO;
import com.example.mentora.enums.TipoUsuario;
import com.example.mentora.model.Aluno;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Professor;
import com.example.mentora.model.ProfessorDisciplina;
import com.example.mentora.model.Secretaria;
import com.example.mentora.model.Turma;
import com.example.mentora.model.Usuario;
import com.example.mentora.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioServiceImpl.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;
    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final ProfessorDisciplinaRepository professorDisciplinaRepository;
    private final SecretariaRepository secretariaRepository;

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder,
                              AlunoRepository alunoRepository,
                              TurmaRepository turmaRepository,
                              ProfessorRepository professorRepository,
                              DisciplinaRepository disciplinaRepository,
                              ProfessorDisciplinaRepository professorDisciplinaRepository,
                              SecretariaRepository secretariaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.alunoRepository = alunoRepository;
        this.turmaRepository = turmaRepository;
        this.professorRepository = professorRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.professorDisciplinaRepository = professorDisciplinaRepository;
        this.secretariaRepository = secretariaRepository;
    }

    // ... (método cadastrar e outros existentes)

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarUsuariosAtivos() {
        return usuarioRepository.findAllByAtivoTrue().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarUsuarioAtivoPorId(Long id) {
        Usuario usuario = usuarioRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new RuntimeException("Usuário ativo com ID " + id + " não encontrado."));
        return toResponseDTO(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarTodosOsUsuarios() {
        // O método findAll() do JpaRepository já busca todos (ativos e inativos)
        return usuarioRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarUsuarioPorIdIncluindoInativos(Long id) {
        // O método findById() do JpaRepository já busca independentemente do status 'ativo'
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário com ID " + id + " não encontrado."));
        return toResponseDTO(usuario);
    }


    @Override
    @Transactional
    public void desativarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário com ID " + id + " não encontrado para desativação."));

        if (!usuario.getAtivo()) {
            log.warn("Tentativa de desativar Usuário ID {}, que já está inativo.", id);
            return;
        }
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
        log.info("Usuário ID {} marcado como inativo.", id);
    }

    @Override
    @Transactional
    public void reativarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário com ID " + id + " não encontrado para reativação."));

        if (usuario.getAtivo()) {
            log.warn("Tentativa de reativar Usuário ID {}, que já está ativo.", id);
            return;
        }
        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
        log.info("Usuário ID {} reativado.", id);
    }

    @Override
    public UsuarioResponseDTO autenticar(LoginRequestDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou Senha inválida"));

        if (!usuario.getAtivo()) {
            throw new RuntimeException("Usuário está inativo. Contate o administrador.");
        }

        if (!passwordEncoder.matches(loginDTO.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Email ou Senha inválida");
        }
        return toResponseDTO(usuario);
    }

    @Override
    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .cpf(usuario.getCpf())
                .email(usuario.getEmail())
                .sexo(usuario.getSexo())
                .dtNascimento(usuario.getDataNascimento())
                .tipoUsuario(usuario.getTipoUsuario())
                .ativo(usuario.getAtivo())
                .build();
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
        usuario.setDataNascimento(dto.getDtNascimento());

        TipoUsuario tipo;
        try {
            tipo = TipoUsuario.valueOf(dto.getTipoUsuario().toUpperCase());
            usuario.setTipoUsuario(tipo);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Tipo de usuário inválido. Use: ALUNO, PROFESSOR ou SECRETARIA.");
        }

        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setAtivo(true);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        log.info("Usuário salvo com ID: {}", usuarioSalvo.getId());

        if (tipo == TipoUsuario.ALUNO) {
            if (dto.getTurmaId() == null) {
                throw new RuntimeException("turmaId é obrigatório para cadastrar um ALUNO.");
            }
            Turma turma = turmaRepository.findById(dto.getTurmaId())
                    .orElseThrow(() -> new RuntimeException("Turma com ID " + dto.getTurmaId() + " não encontrada."));

            Aluno aluno = new Aluno();
            aluno.setUsuario(usuarioSalvo);
            aluno.setTurma(turma);
            alunoRepository.save(aluno);
            log.info("Perfil Aluno criado para Usuário ID: {}", usuarioSalvo.getId());

        } else if (tipo == TipoUsuario.PROFESSOR) {
            Professor professor = new Professor();
            professor.setUsuario(usuarioSalvo);
            Professor professorSalvo = professorRepository.save(professor);
            log.info("Perfil Professor criado para Usuário ID: {}", usuarioSalvo.getId());

            if (dto.getDisciplinaIds() != null && !dto.getDisciplinaIds().isEmpty()) {
                for (Long disciplinaId : dto.getDisciplinaIds()) {
                    Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                            .orElseThrow(() -> new RuntimeException("Disciplina com ID " + disciplinaId + " não encontrada."));
                    ProfessorDisciplina professorDisciplina = new ProfessorDisciplina();
                    professorDisciplina.setProfessor(professorSalvo);
                    professorDisciplina.setDisciplina(disciplina);
                    professorDisciplinaRepository.save(professorDisciplina);
                    log.info("Vinculado Professor ID {} com Disciplina ID {}", professorSalvo.getId(), disciplina.getId());
                }
            } else {
                log.warn("Nenhum disciplinaIds fornecido para o Professor com Usuário ID {}", usuarioSalvo.getId());
            }
        } else if (tipo == TipoUsuario.SECRETARIA) {
            Secretaria secretaria = new Secretaria();
            secretaria.setUsuario(usuarioSalvo);
            secretariaRepository.save(secretaria);
            log.info("Perfil Secretaria criado para Usuário ID: {}", usuarioSalvo.getId());
        }
        return toResponseDTO(usuarioSalvo);
    }
    public UsuarioResponseDTO atualizar(Long id, UsuarioUpdateDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSexo(dto.getSexo());
        // atualize os outros campos aqui

        usuarioRepository.save(usuario);
        return toResponseDTO(usuario);
    }

}
