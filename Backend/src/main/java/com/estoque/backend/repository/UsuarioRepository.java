package com.estoque.backend.repository;

import com.estoque.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repositório responsável pelas operações de banco de dados da tabela de usuários
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Procura um usuário específico no banco através do seu login de acesso
    Optional<Usuario> findByUsuario(String usuario);
}