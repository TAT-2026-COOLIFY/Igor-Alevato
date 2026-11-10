package com.estoque.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

// Objeto de transferência de dados para registrar a entrada de mercadorias no estoque
@Getter
@Setter
public class EntradaEstoqueDTO {

    // ID do produto que está recebendo reposição de estoque
    private Long produtoId;

    // ID do usuário (gerente ou funcionário) responsável pelo registro da entrada
    private Long usuarioId;

    // Quantidade de itens que serão somados ao saldo atual do produto
    private BigDecimal quantidade;
}