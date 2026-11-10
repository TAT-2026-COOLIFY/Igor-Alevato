package com.estoque.backend.repository;

import com.estoque.backend.model.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositório que gerencia o armazenamento e a consulta do histórico de movimentações
@Repository
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
}