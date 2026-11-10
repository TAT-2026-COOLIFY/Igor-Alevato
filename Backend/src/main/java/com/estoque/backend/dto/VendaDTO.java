package com.estoque.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

// Objeto que agrupa o responsável pela venda e a lista de produtos comercializados
@Getter
@Setter
public class VendaDTO {

    // ID do usuário que realizou a venda
    private Long usuarioId;

    // Lista contendo todos os produtos, quantidades e preços incluídos na venda
    private List<ItemVendaDTO> itens;
}