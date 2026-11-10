package com.estoque.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

// Entidade que representa os itens individuais pertencentes a uma venda
@Entity
@Table(name = "itens_venda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemVenda {

    // Identificador único do item da venda
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quantidade vendida do produto
    private BigDecimal quantidade;

    // Preço unitário do produto no momento da venda
    @Column(name = "preco_unitario")
    private BigDecimal precoUnitario;

    // Valor subtotal do item (quantidade multiplicada pelo preço unitário)
    private BigDecimal subtotal;

    // Venda principal à qual este item está vinculado
    @ManyToOne
    @JoinColumn(name = "vendas_id", nullable = false)
    private Venda venda;

    // Produto comercializado neste item
    @ManyToOne
    @JoinColumn(name = "produtos_id", nullable = false)
    private Produto produto;
}