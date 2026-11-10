package com.estoque.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

// Entidade que representa a tabela de produtos no banco de dados
@Entity
@Table(name = "produtos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    // Identificador único do produto (chave primária)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome comercial da mercadoria
    private String nome;

    // Descrição complementar do produto
    private String descricao;

    // Valor unitário de venda do produto
    @Column(name = "preco_venda")
    private BigDecimal precoVenda;

    // Saldo disponível atualmente no estoque
    @Column(name = "quantidade_atual")
    private BigDecimal quantidadeAtual;

    // Limite mínimo para acionar o alerta de estoque crítico
    @Column(name = "estoque_minimo")
    private BigDecimal estoqueMinimo;

    // Unidade de medida (ex: Kg, Un, L)
    @Column(name = "tipo_unidade")
    private String tipoUnidade;

    // Relacionamento muitos-para-um: vários produtos pertencem a uma categoria
    @ManyToOne
    @JoinColumn(name = "categorias_id", nullable = false)
    private Categoria categoria;
}