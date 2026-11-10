package com.estoque.backend.service;

import com.estoque.backend.model.Categoria;
import com.estoque.backend.model.Produto;
import com.estoque.backend.repository.CategoriaRepository;
import com.estoque.backend.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Serviço responsável pelas regras de negócio e operações do catálogo de produtos
@Service
public class ProdutoService {

    // Injeta os repositórios de produtos e categorias
    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Lista todos os produtos cadastrados no banco de dados
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    // Procura um produto específico pelo seu ID
    public Optional<Produto> buscarPorId(Long id) {
        return produtoRepository.findById(id);
    }

    // Guarda um novo produto ou atualiza os dados de um produto existente
    public Produto salvar(Produto produto) {
        // Garante que a categoria vinculada existe no banco antes de salvar o produto
        if (produto.getCategoria() != null && produto.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(produto.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada!"));
            produto.setCategoria(categoria);
        }
        return produtoRepository.save(produto);
    }

    // Exclui um produto do banco de dados pelo seu ID
    public void deletar(Long id) {
        produtoRepository.deleteById(id);
    }

    // Retorna a lista de produtos com saldo igual ou inferior ao estoque mínimo (RN04)
    public List<Produto> listarProdutosComEstoqueBaixo() {
        return produtoRepository.buscarProdutosComEstoqueBaixo();
    }
}