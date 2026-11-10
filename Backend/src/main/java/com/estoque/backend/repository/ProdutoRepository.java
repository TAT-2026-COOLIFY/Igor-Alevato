package com.estoque.backend.repository;

import com.estoque.backend.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repositório responsável pelas operações de banco de dados da tabela de produtos
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Consulta personalizada que retorna os produtos com saldo atual menor ou igual ao estoque mínimo
    @Query("SELECT p FROM Produto p WHERE p.quantidadeAtual <= p.estoqueMinimo")
    List<Produto> buscarProdutosComEstoqueBaixo();
}