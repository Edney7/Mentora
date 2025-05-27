package com.example.mentora.service.usuario;

import com.example.mentora.dto.usuario.LoginRequestDTO;
import com.example.mentora.dto.usuario.UsuarioCreateDTO;
import com.example.mentora.dto.usuario.UsuarioResponseDTO;
import com.example.mentora.enums.TipoUsuario;
import com.example.mentora.model.Aluno;
import com.example.mentora.model.Disciplina; // Importar Disciplina
import com.example.mentora.model.Professor; // Importar Professor
import com.example.mentora.model.ProfessorDisciplina; // Importar ProfessorDisciplina
import com.example.mentora.model.Turma;
import com.example.mentora.model.Usuario;
import com.example.mentora.repository.AlunoRepository;
import com.example.mentora.repository.DisciplinaRepository; // Importar DisciplinaRepository
import com.example.mentora.repository.ProfessorDisciplinaRepository; // Importar ProfessorDisciplinaRepository
import com.example.mentora.repository.ProfessorRepository; // Importar ProfessorRepository
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
    private final ProfessorRepository professorRepository; // Injetar ProfessorRepository
    private final DisciplinaRepository disciplinaRepository; // Injetar DisciplinaRepository
    private final ProfessorDisciplinaRepository professorDisciplinaRepository; // Injetar ProfessorDisciplinaRepository


    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder,
                              AlunoRepository alunoRepository,
                              TurmaRepository turmaRepository,
                              ProfessorRepository professorRepository, // Adicionar ao construtor
                              DisciplinaRepository disciplinaRepository, // Adicionar ao construtor
                              ProfessorDisciplinaRepository professorDisciplinaRepository) { // Adicionar ao construtor
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.alunoRepository = alunoRepository;
        this.turmaRepository = turmaRepository;
        this.professorRepository = professorRepository; // Atribuir
        this.disciplinaRepository = disciplinaRepository; // Atribuir
        this.professorDisciplinaRepository = professorDisciplinaRepository; // Atribuir
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
        // Se o campo na entidade Usuario ainda for dtNascimento, use setDtNascimento
        usuario.setDataNascimento(dto.getDtNascimento());


        TipoUsuario tipo;
        try {
            tipo = TipoUsuario.valueOf(dto.getTipoUsuario().toUpperCase());
            usuario.setTipoUsuario(tipo);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Tipo de usuário inválido. Use: ALUNO, PROFESSOR ou SECRETARIA.");
        }

        // Assumindo que Usuario.java tem o campo senha e setter correspondente
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setAtivo(true);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        System.out.println("DEBUG: ID do Usuario salvo: " + (usuarioSalvo != null ? usuarioSalvo.getId() : "usuarioSalvo é null ou ID é null"));

        // Lógica para Aluno
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
        }
        // Lógica para Professor
        else if (tipo == TipoUsuario.PROFESSOR) {
            Professor professor = new Professor();
            professor.setUsuario(usuarioSalvo);
            Professor professorSalvo = professorRepository.save(professor);
            System.out.println("DEBUG: ID do Professor salvo: " + (professorSalvo != null ? professorSalvo.getId() : "professorSalvo é null ou ID é null"));


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
                // Você pode decidir se quer lançar uma exceção aqui caso seja obrigatório
                // ou apenas logar um aviso como feito acima.
            }
        }
        // Adicionar lógica para SECRETARIA se necessário
        // else if (tipo == TipoUsuario.SECRETARIA) { ... }


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
        // Assumindo que Usuario.java tem getDataNascimento() e getSenha()
        // Se os campos na entidade Usuario ainda forem dtNascimento e senha, use os getters correspondentes
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

        // Assumindo que Usuario.java tem getSenha()
        if (!passwordEncoder.matches(loginDTO.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Email ou Senha inválida");
        }

        return toResponseDTO(usuario);
    }
}
