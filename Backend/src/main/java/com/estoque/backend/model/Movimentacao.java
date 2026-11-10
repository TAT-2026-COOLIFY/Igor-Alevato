package com.estoque.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Entidade que regista o histórico de entradas e saídas na tabela movimentacoes
@Entity
@Table(name = "movimentacoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Movimentacao {

    // Identificador único da movimentação
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Indica se a operação foi uma "ENTRADA" ou uma "SAIDA"
    @Column(name = "tipo_movimentacao")
    private String tipoMovimentacao;

    // Quantidade movimentada na operação
    private BigDecimal quantidade;

    // Data e hora exatas da movimentação formatadas no padrão ISO para o Angular
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "data_hora", updatable = false)
    private LocalDateTime dataHora;

    // Usuário responsável por registar a movimentação
    @ManyToOne
    @JoinColumn(name = "usuarios_id", nullable = false)
    private Usuario usuario;

    // Produto que teve o seu saldo movimentado
    @ManyToOne
    @JoinColumn(name = "produtos_id", nullable = false)
    private Produto produto;

    // Preenche a data e hora atuais automaticamente antes de gravar no banco
    @PrePersist
    public void prePersist() {
        if (this.dataHora == null) {
            this.dataHora = LocalDateTime.now();
        }
    }
}