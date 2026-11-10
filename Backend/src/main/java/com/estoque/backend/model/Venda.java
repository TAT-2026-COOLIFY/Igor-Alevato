package com.estoque.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Entidade que representa o cabeçalho de uma venda na tabela vendas
@Entity
@Table(name = "vendas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Venda {

    // Identificador único da venda
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Data e hora em que a venda foi realizada
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "data_venda", updatable = false)
    private LocalDateTime dataVenda;

    // Soma financeira total dos itens da venda
    @Column(name = "valor_total")
    private BigDecimal valorTotal;

    // Usuário que efetuou a venda
    @ManyToOne
    @JoinColumn(name = "usuarios_id", nullable = false)
    private Usuario usuario;

    // Regista a data e hora atuais automaticamente ao criar a venda
    @PrePersist
    public void prePersist() {
        if (this.dataVenda == null) {
            this.dataVenda = LocalDateTime.now();
        }
    }
}