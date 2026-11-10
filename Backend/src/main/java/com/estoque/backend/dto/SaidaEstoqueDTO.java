package com.estoque.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

// Objeto de transferência de dados para registrar a saída (baixa) de mercadorias do estoque
@Getter
@Setter
public class SaidaEstoqueDTO {

    // ID do produto que está sendo retirado do estoque
    private Long produtoId;

    // ID do usuário responsável pela realização da saída
    private Long usuarioId;

    // Quantidade de itens que serão descontados do saldo atual do produto
    private BigDecimal quantidade;
}