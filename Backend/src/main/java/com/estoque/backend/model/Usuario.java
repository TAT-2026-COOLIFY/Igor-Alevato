package com.estoque.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

// Entidade que representa a tabela de usuários do sistema
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    // Identificador único do usuário (chave primária)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome completo do colaborador
    private String nome;

    // Nome de utilizador único usado para realizar o login
    @Column(unique = true)
    private String usuario;

    // Senha de acesso ao sistema
    private String senha;

    // Define se a conta está ativa (true) ou inativa (false)
    private Boolean ativo;

    // Permissões de acesso às funcionalidades do sistema
    @Column(name = "pode_gerenciar_produtos")
    private Boolean podeGerenciarProdutos;

    @Column(name = "pode_fazer_entrada")
    private Boolean podeFazerEntrada;

    @Column(name = "pode_fazer_saida")
    private Boolean podeFazerSaida;

    @Column(name = "pode_gerenciar_usuarios")
    private Boolean podeGerenciarUsuarios;

    // Data e hora em que o registo do usuário foi criado
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "data_cadastro", updatable = false)
    private LocalDateTime dataCadastro;

    // Define os valores padrão automaticamente antes de salvar um novo usuário no banco
    @PrePersist
    public void prePersist() {
        if (this.ativo == null) {
            this.ativo = true;
        }
        if (this.dataCadastro == null) {
            this.dataCadastro = LocalDateTime.now();
        }
        if (this.podeGerenciarProdutos == null) this.podeGerenciarProdutos = false;
        if (this.podeFazerEntrada == null) this.podeFazerEntrada = false;
        if (this.podeFazerSaida == null) this.podeFazerSaida = false;
        if (this.podeGerenciarUsuarios == null) this.podeGerenciarUsuarios = false;
    }
}