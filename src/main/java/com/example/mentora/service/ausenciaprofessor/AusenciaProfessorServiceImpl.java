package com.example.mentora.service.ausenciaprofessor; // Crie este pacote se necessário

import com.example.mentora.dto.ausenciaprofessor.AusenciaProfessorCreateDTO;
import com.example.mentora.dto.ausenciaprofessor.AusenciaProfessorResponseDTO;
import com.example.mentora.model.AusenciaProfessor;
import com.example.mentora.model.Professor;
import com.example.mentora.model.Usuario; // Para aceder ao nome do utilizador do professor
import com.example.mentora.repository.AusenciaProfessorRepository;
import com.example.mentora.repository.ProfessorRepository;
import com.example.mentora.repository.UsuarioRepository; // Para verificar o papel do utilizador logado (ex: Secretaria)

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AusenciaProfessorServiceImpl implements AusenciaProfessorService {

    private static final Logger log = LoggerFactory.getLogger(AusenciaProfessorServiceImpl.class);

    private final AusenciaProfessorRepository ausenciaProfessorRepository;
    private final ProfessorRepository professorRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public AusenciaProfessorServiceImpl(AusenciaProfessorRepository ausenciaProfessorRepository,
                                        ProfessorRepository professorRepository,
                                        UsuarioRepository usuarioRepository) {
        this.ausenciaProfessorRepository = ausenciaProfessorRepository;
        this.professorRepository = professorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public AusenciaProfessorResponseDTO registarAusencia(AusenciaProfessorCreateDTO dto, Long professorLogadoUsuarioId) {
        log.info("A registar ausência para professor ID {} na data {}, por utilizador logado ID {}",
                dto.getProfessorId(), dto.getDataAusencia(), professorLogadoUsuarioId);

        Professor professorAlvo = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> {
                    log.warn("Professor alvo com ID {} não encontrado ao registar ausência.", dto.getProfessorId());
                    return new RuntimeException("Professor alvo com ID " + dto.getProfessorId() + " não encontrado.");
                });

        if (professorLogadoUsuarioId != null) {
            Professor professorLogado = professorRepository.findByUsuarioId(professorLogadoUsuarioId)
                    .orElseThrow(() -> {
                        log.error("Perfil de Professor não encontrado para o utilizador logado ID {} que tentou registar ausência.", professorLogadoUsuarioId);
                        return new RuntimeException("Perfil de Professor não encontrado para o utilizador autenticado.");
                    });
            if (!professorLogado.getId().equals(professorAlvo.getId())) {
                log.warn("Utilizador Professor ID {} tentou registar ausência para outro Professor ID {}.", professorLogado.getId(), professorAlvo.getId());
                throw new RuntimeException("Professores só podem registar as suas próprias ausências."); // Usar exceção de Acesso Negado
            }
        }
        if (professorAlvo.getUsuario() == null || !professorAlvo.getUsuario().getAtivo()) {
            log.warn("Tentativa de registar ausência para professor (Utilizador ID {}) inativo.",
                    professorAlvo.getUsuario() != null ? professorAlvo.getUsuario().getId() : "N/A");
            throw new RuntimeException("Não é possível registar ausência para um professor inativo.");
        }

        if (ausenciaProfessorRepository.existsByProfessorIdAndDataAusencia(professorAlvo.getId(), dto.getDataAusencia())) {
            log.warn("Já existe uma ausência registada para o professor ID {} na data {}.", professorAlvo.getId(), dto.getDataAusencia());
            throw new RuntimeException("Já existe uma ausência registada para este professor nesta data.");
        }


        AusenciaProfessor ausencia = new AusenciaProfessor();
        ausencia.setProfessor(professorAlvo);
        ausencia.setDataAusencia(dto.getDataAusencia());
        ausencia.setMotivo(dto.getMotivo());

        AusenciaProfessor ausenciaSalva = ausenciaProfessorRepository.save(ausencia);
        log.info("Ausência ID {} registada com sucesso para professor ID {} na data {}.",
                ausenciaSalva.getId(), professorAlvo.getId(), ausenciaSalva.getDataAusencia());

        return toAusenciaProfessorResponseDTO(ausenciaSalva);
    }

    @Override
    @Transactional(readOnly = true)
    public AusenciaProfessorResponseDTO buscarAusenciaPorId(Long id) {
        log.debug("A buscar ausência de professor com ID: {}", id);
        AusenciaProfessor ausencia = ausenciaProfessorRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Ausência de professor com ID {} não encontrada.", id);
                    return new RuntimeException("Ausência de professor com ID " + id + " não encontrada.");
                });
        return toAusenciaProfessorResponseDTO(ausencia);
    }
    public List<AusenciaProfessorResponseDTO> filtrarAusencias(String nome, Integer mesAusencia, Integer mesRegistro) {
        List<AusenciaProfessor> todas = ausenciaProfessorRepository.findAll();

        return todas.stream()
                .filter(a -> nome == null || a.getProfessor().getUsuario().getNome().toLowerCase().contains(nome.toLowerCase()))
                .filter(a -> mesAusencia == null || a.getDataAusencia().getMonthValue() == mesAusencia)
                .filter(a -> mesRegistro == null || a.getDataRegistro().getMonthValue() == mesRegistro)
                .map(this::toAusenciaProfessorResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AusenciaProfessorResponseDTO> listarAusenciasPorProfessor(Long professorId) {
        log.debug("A listar ausências para o professor ID: {}", professorId);
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor com ID " + professorId + " não encontrado."));

        List<AusenciaProfessor> ausencias = ausenciaProfessorRepository.findByProfessorIdOrderByDataAusenciaDesc(professorId);
        return ausencias.stream().map(this::toAusenciaProfessorResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AusenciaProfessorResponseDTO> listarAusenciasPorData(LocalDate dataAusencia) {
        log.debug("A listar ausências de professor para a data: {}", dataAusencia);
        List<AusenciaProfessor> ausencias = ausenciaProfessorRepository.findByDataAusencia(dataAusencia);
        return ausencias.stream()
                .filter(a -> a.getProfessor() != null && a.getProfessor().getUsuario() != null && a.getProfessor().getUsuario().getAtivo())
                .map(this::toAusenciaProfessorResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AusenciaProfessorResponseDTO> listarTodasAusencias() {
        log.debug("A listar todas as ausências de professores.");
        List<AusenciaProfessor> ausencias = ausenciaProfessorRepository.findAllByOrderByDataAusenciaDesc();
        return ausencias.stream()
                .filter(a -> a.getProfessor() != null && a.getProfessor().getUsuario() != null && a.getProfessor().getUsuario().getAtivo())
                .map(this::toAusenciaProfessorResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelarAusencia(Long ausenciaId, Long usuarioLogadoId) {
        log.info("Utilizador ID {} a tentar cancelar ausência ID: {}", usuarioLogadoId, ausenciaId);
        AusenciaProfessor ausencia = ausenciaProfessorRepository.findById(ausenciaId)
                .orElseThrow(() -> {
                    log.warn("Ausência com ID {} não encontrada para cancelamento.", ausenciaId);
                    return new RuntimeException("Ausência com ID " + ausenciaId + " não encontrada.");
                });

        Usuario utilizadorLogado = usuarioRepository.findById(usuarioLogadoId)
                .orElseThrow(() -> new RuntimeException("Utilizador autenticado não encontrado."));

        boolean podeCancelar = false;
        if ("PROFESSOR".equals(utilizadorLogado.getTipoUsuario().name())) {
            Professor professorLogado = professorRepository.findByUsuarioId(utilizadorLogado.getId())
                    .orElse(null);
            if (professorLogado != null && professorLogado.getId().equals(ausencia.getProfessor().getId())) {
                podeCancelar = true;
            }
        }
        else if ("SECRETARIA".equals(utilizadorLogado.getTipoUsuario().name())) {
            podeCancelar = true;
        }

        if (!podeCancelar) {
            log.warn("Utilizador ID {} não tem permissão para cancelar a ausência ID {}.", usuarioLogadoId, ausenciaId);
            throw new RuntimeException("Você não tem permissão para cancelar esta ausência.");
        }

        if (ausencia.getDataAusencia().isBefore(LocalDate.now())) {
            log.warn("Tentativa de cancelar ausência ID {} que já ocorreu (data: {}).", ausenciaId, ausencia.getDataAusencia());
            throw new RuntimeException("Não é possível cancelar ausências que já ocorreram.");
        }

        ausenciaProfessorRepository.delete(ausencia);
        log.info("Ausência ID {} cancelada com sucesso pelo utilizador ID {}.", ausenciaId, usuarioLogadoId);
    }

    private AusenciaProfessorResponseDTO toAusenciaProfessorResponseDTO(AusenciaProfessor ausencia) {
        Professor professor = ausencia.getProfessor();
        String nomeProfessor = (professor != null && professor.getUsuario() != null) ? professor.getUsuario().getNome() : "Professor não disponível";

        return AusenciaProfessorResponseDTO.builder()
                .id(ausencia.getId())
                .dataAusencia(ausencia.getDataAusencia())
                .motivo(ausencia.getMotivo())
                .dataRegistro(ausencia.getDataRegistro())
                .professorId(professor != null ? professor.getId() : null)
                .nomeProfessor(nomeProfessor)
                .build();
    }
}