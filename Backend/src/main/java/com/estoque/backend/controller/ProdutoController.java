package com.estoque.backend.controller;

import com.estoque.backend.model.Produto;
import com.estoque.backend.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    // Injeta o serviço contendo a lógica de gerenciamento de produtos
    @Autowired
    private ProdutoService produtoService;

    // Lista todos os produtos cadastrados no catálogo
    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.listarTodos();
    }

    // Lista apenas os produtos com quantidade igual ou abaixo do estoque mínimo (Tela de Alertas)
    @GetMapping("/estoque-baixo")
    public List<Produto> listarProdutosComEstoqueBaixo() {
        return produtoService.listarProdutosComEstoqueBaixo();
    }

    // Busca os dados de um produto específico pelo seu ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Cadastra um novo produto no estoque
    @PostMapping
    public Produto salvar(@RequestBody Produto produto) {
        return produtoService.salvar(produto);
    }

    // Atualiza os dados de um produto existente pelo ID informado na URL
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        return produtoService.buscarPorId(id)
                .map(produtoExistente -> {
                    produtoAtualizado.setId(id);
                    Produto produtoSalvo = produtoService.salvar(produtoAtualizado);
                    return ResponseEntity.ok(produtoSalvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Remove um produto do banco de dados pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}