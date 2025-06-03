package com.example.mentora.service.evento;

import com.example.mentora.dto.evento.EventoCreateDTO;
import com.example.mentora.dto.evento.EventoResponseDTO;
import com.example.mentora.model.Calendario;
import com.example.mentora.model.Evento;
import com.example.mentora.model.Secretaria;
import com.example.mentora.repository.CalendarioRepository;
import com.example.mentora.repository.EventoRepository;
import com.example.mentora.repository.SecretariaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventoServiceImpl implements EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private SecretariaRepository secretariaRepository;

    @Autowired
    private CalendarioRepository calendarioRepository;

    @Override
    public EventoResponseDTO criarEvento(EventoCreateDTO dto) {
        Secretaria secretaria = secretariaRepository.findById(dto.getIdSecretaria())
                .orElseThrow(() -> new RuntimeException("Secretaria não encontrada"));

        Calendario calendario = calendarioRepository.findById(dto.getIdCalendario())
                .orElseThrow(() -> new RuntimeException("Calendário não encontrado"));

        Evento evento = new Evento();
        evento.setTitulo(dto.getTitulo());
        evento.setDescricao(dto.getDescricao());
        evento.setData(dto.getData());
        evento.setTipo(dto.getTipo());
        evento.setSecretaria(secretaria);
        evento.setCalendario(calendario);

        Evento salvo = eventoRepository.save(evento);

        return EventoResponseDTO.builder()
                .idEvento(salvo.getIdEvento())
                .titulo(salvo.getTitulo())
                .descricao(salvo.getDescricao())
                .data(salvo.getData())
                .tipo(salvo.getTipo())
                .build();
    }

    @Override
    public List<EventoResponseDTO> listarEventos() {
        return eventoRepository.findAll()
                .stream()
                .map(ev -> EventoResponseDTO.builder()
                        .idEvento(ev.getIdEvento())
                        .titulo(ev.getTitulo())
                        .descricao(ev.getDescricao())
                        .data(ev.getData())
                        .tipo(ev.getTipo())
                        .build())
                .collect(Collectors.toList());
    }
}
