package com.example.mentora.repository;

import com.example.mentora.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByCalendario_Id (Long idCalendario);
}


