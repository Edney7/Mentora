package com.example.mentora.service.usuario;

import com.example.mentora.dto.usuario.LoginRequestDTO;
import com.example.mentora.dto.usuario.UsuarioCreateDTO;
import com.example.mentora.dto.usuario.UsuarioResponseDTO;
import com.example.mentora.enums.TipoUsuario;
import com.example.mentora.model.Aluno;
import com.example.mentora.model.Disciplina;
import com.example.mentora.model.Professor;
import com.example.mentora.model.ProfessorDisciplina;
import com.example.mentora.model.Secretaria; // Importar Secretaria
import com.example.mentora.model.Turma;
import com.example.mentora.model.Usuario;
import com.example.mentora.repository.AlunoRepository;
import com.example.mentora.repository.DisciplinaRepository;
import com.example.mentora.repository.ProfessorDisciplinaRepository;
import com.example.mentora.repository.ProfessorRepository;
import com.example.mentora.repository.SecretariaRepository; // Importar SecretariaRepository
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
    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final ProfessorDisciplinaRepository professorDisciplinaRepository;
    private final SecretariaRepository secretariaRepository; // Injetar SecretariaRepository


    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder,
                              AlunoRepository alunoRepository,
                              TurmaRepository turmaRepository,
                              ProfessorRepository professorRepository,
                              DisciplinaRepository disciplinaRepository,
                              ProfessorDisciplinaRepository professorDisciplinaRepository,
                              SecretariaRepository secretariaRepository) { // Adicionar ao construtor
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.alunoRepository = alunoRepository;
        this.turmaRepository = turmaRepository;
        this.professorRepository = professorRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.professorDisciplinaRepository = professorDisciplinaRepository;
        this.secretariaRepository = secretariaRepository; // Atribuir
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
        // Assumindo que Usuario.java tem o campo dataNascimento e setter correspondente
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
        System.out.println("DEBUG: ID do Usuario salvo: " + (usuarioSalvo != null ? usuarioSalvo.getId() : "usuarioSalvo é null ou ID é null"));

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
            System.out.println("DEBUG: Aluno criado e vinculado ao usuário ID " + usuarioSalvo.getId());

        } else if (tipo == TipoUsuario.PROFESSOR) {
            Professor professor = new Professor();
            professor.setUsuario(usuarioSalvo);
            Professor professorSalvo = professorRepository.save(professor);
            System.out.println("DEBUG: Professor criado com ID " + professorSalvo.getId() + " vinculado ao usuário ID " + usuarioSalvo.getId());

            if (dto.getDisciplinaIds() != null && !dto.getDisciplinaIds().isEmpty()) {
                for (Long disciplinaId : dto.getDisciplinaIds()) {
                    Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                            .orElseThrow(() -> new RuntimeException("Disciplina com ID " + disciplinaId + " não encontrada."));

                    ProfessorDisciplina professorDisciplina = new ProfessorDisciplina();
                    professorDisciplina.setProfessor(professorSalvo);
                    professorDisciplina.setDisciplina(disciplina);
                    professorDisciplinaRepository.save(professorDisciplina);
                    System.out.println("DEBUG: Vinculado Professor ID " + professorSalvo.getId() + " com Disciplina ID " + disciplina.getId());
                }
            } else {
                System.out.println("WARN: Nenhum disciplinaIds fornecido para o Professor ID " + professorSalvo.getId());
            }
        } else if (tipo == TipoUsuario.SECRETARIA) {
            Secretaria secretaria = new Secretaria();
            secretaria.setUsuario(usuarioSalvo);
            Secretaria secretariaSalva = secretariaRepository.save(secretaria);
            System.out.println("DEBUG: Secretaria criada com ID " + secretariaSalva.getId() + " vinculada ao usuário ID " + usuarioSalvo.getId());
        }

        return toResponseDTO(usuarioSalvo);
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
        // Assumindo que Usuario.java tem getDataNascimento()
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .cpf(usuario.getCpf())
                .email(usuario.getEmail())
                .sexo(usuario.getSexo())
                .dtNascimento(usuario.getDataNascimento())
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
