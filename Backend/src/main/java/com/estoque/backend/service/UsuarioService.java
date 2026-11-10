package com.estoque.backend.service;

import com.estoque.backend.model.Usuario;
import com.estoque.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Serviço responsável pelo gerenciamento de usuários e credenciais de acesso
@Service
public class UsuarioService {

    // Injeta o repositório de usuários
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Lista todos os usuários cadastrados no sistema
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // Procura um usuário específico pelo seu ID
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    // Guarda um novo usuário ou atualiza os dados e permissões de um usuário existente
    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Remove um usuário do banco de dados pelo seu ID
    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }
}