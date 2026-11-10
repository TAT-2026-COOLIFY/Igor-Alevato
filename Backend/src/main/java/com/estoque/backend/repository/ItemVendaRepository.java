package com.estoque.backend.repository;

import com.estoque.backend.model.ItemVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repositório responsável pelas operações de banco de dados dos itens de uma venda
@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {

    // Lista todos os itens vinculados ao ID de uma venda específica
    List<ItemVenda> findByVendaId(Long vendaId);
}