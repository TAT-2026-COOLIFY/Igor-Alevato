package com.estoque.backend.repository;

import com.estoque.backend.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositório que fornece os métodos prontos de acesso à tabela de categorias no banco de dados
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}