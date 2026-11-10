package com.estoque.backend.service;

import com.estoque.backend.model.Categoria;
import com.estoque.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Serviço responsável pelas regras de negócio e gerenciamento das categorias
@Service
public class CategoriaService {

    // Injeta o repositório de categorias para acesso ao banco de dados
    @Autowired
    private CategoriaRepository categoriaRepository;

    // Retorna a lista com todas as categorias cadastradas
    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    // Procura uma categoria específica pelo seu ID
    public Optional<Categoria> buscarPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    // Guarda uma nova categoria ou atualiza uma existente no banco de dados
    public Categoria salvar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // Remove uma categoria do banco de dados pelo seu ID
    public void deletar(Long id) {
        categoriaRepository.deleteById(id);
    }
}