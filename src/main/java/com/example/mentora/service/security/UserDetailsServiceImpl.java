package com.example.mentora.service.security;

import com.example.mentora.model.Usuario;
import com.example.mentora.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Busca o usuário pelo email
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + email));

        // Cria e retorna um objeto UserDetails
        return new User(
                usuario.getEmail(),
                usuario.getSenha(),
                usuario.getAtivo(), // O quarto parâmetro verifica se a conta está ativa
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                // Converte o nosso TipoUsuario enum para uma autoridade que o Spring Security entende (ex: "ROLE_ALUNO")
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getTipoUsuario().name()))
        );
    }
}