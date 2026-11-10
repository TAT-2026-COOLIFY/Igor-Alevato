package com.estoque.backend.controller;

import com.estoque.backend.model.Usuario;
import com.estoque.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    // Injeta o serviço de gerenciamento de usuários e permissões
    @Autowired
    private UsuarioService usuarioService;

    // Lista todos os usuários para autenticação e gerenciamento
    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    // Busca um usuário específico pelo ID na URL
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Cadastra ou atualiza os dados e permissões de um usuário
    @PostMapping
    public Usuario salvar(@RequestBody Usuario usuario) {
        return usuarioService.salvar(usuario);
    }

    // Atualiza os dados de um usuário específico pelo ID na URL
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado) {
        return usuarioService.buscarPorId(id)
                .map(usuarioExistente -> {
                    usuarioAtualizado.setId(id);
                    Usuario salvo = usuarioService.salvar(usuarioAtualizado);
                    return ResponseEntity.ok(salvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Remove um usuário do banco de dados pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}