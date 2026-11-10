package com.estoque.backend.repository;

import com.estoque.backend.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositório responsável pelas operações de banco de dados da tabela de vendas
@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
}