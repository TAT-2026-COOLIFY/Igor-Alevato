package com.estoque.backend.controller;

import com.estoque.backend.model.Categoria;
import com.estoque.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

    // Injeta o repositório para comunicação com a tabela de categorias no banco
    @Autowired
    private CategoriaRepository categoriaRepository;

    // Lista todas as categorias cadastradas no sistema
    @GetMapping
    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    // Cadastra uma nova categoria no banco de dados
    @PostMapping
    public Categoria salvar(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // Atualiza o nome de uma categoria existente buscando pelo ID na URL
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> atualizar(@PathVariable Long id, @RequestBody Categoria categoriaDetalhes) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNome(categoriaDetalhes.getNome());
                    Categoria atualizada = categoriaRepository.save(categoria);
                    return ResponseEntity.ok(atualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Exclui uma categoria do banco de dados pelo ID informado na URL
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}