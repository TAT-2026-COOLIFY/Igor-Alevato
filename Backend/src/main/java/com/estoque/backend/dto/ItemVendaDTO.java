package com.estoque.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

// Objeto que representa os dados de um item específico dentro de uma venda
@Getter
@Setter
public class ItemVendaDTO {

    // ID do produto vendido
    private Long produtoId;

    // Quantidade vendida deste produto
    private BigDecimal quantidade;

    // Preço unitário praticado no momento da venda
    private BigDecimal precoUnitario;
}