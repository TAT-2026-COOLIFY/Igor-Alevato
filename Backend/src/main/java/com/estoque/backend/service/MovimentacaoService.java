package com.estoque.backend.service;

import com.estoque.backend.dto.EntradaEstoqueDTO;
import com.estoque.backend.dto.SaidaEstoqueDTO;
import com.estoque.backend.model.Movimentacao;
import com.estoque.backend.model.Produto;
import com.estoque.backend.model.Usuario;
import com.estoque.backend.repository.MovimentacaoRepository;
import com.estoque.backend.repository.ProdutoRepository;
import com.estoque.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Serviço responsável pelo processamento de entradas e saídas de mercadorias
@Service
public class MovimentacaoService {

    // Injeta os repositórios necessários para atualizar produtos e registar o histórico
    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Lista todas as movimentações registadas no histórico do sistema
    public List<Movimentacao> listarTodas() {
        return movimentacaoRepository.findAll();
    }

    // Regista a entrada de mercadorias e soma a quantidade ao saldo atual do produto
    @Transactional
    public Movimentacao registrarEntrada(EntradaEstoqueDTO dto) {
        // Procura o produto que está a receber reposição no banco de dados
        Produto produto = produtoRepository.findById(dto.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

        // Identifica o usuário responsável pelo lançamento da entrada
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        // Soma a quantidade recebida ao estoque atual do produto e salva
        produto.setQuantidadeAtual(produto.getQuantidadeAtual().add(dto.getQuantidade()));
        produtoRepository.save(produto);

        // Cria e grava o registo da movimentação do tipo ENTRADA no histórico
        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setTipoMovimentacao("ENTRADA");
        movimentacao.setQuantidade(dto.getQuantidade());
        movimentacao.setProduto(produto);
        movimentacao.setUsuario(usuario);

        return movimentacaoRepository.save(movimentacao);
    }

    // Regista a saída de mercadorias validando se há saldo suficiente em estoque
    @Transactional
    public Movimentacao registrarSaida(SaidaEstoqueDTO dto) {
        // Procura o produto que será retirado do estoque
        Produto produto = produtoRepository.findById(dto.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

        // Identifica o usuário responsável pela retirada
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        // Regra de Negócio RN03: impede a saída caso a quantidade solicitada seja maior que o estoque atual
        if (produto.getQuantidadeAtual().compareTo(dto.getQuantidade()) < 0) {
            throw new RuntimeException("Estoque insuficiente para a saída!");
        }

        // Subtrai a quantidade retirada do estoque atual do produto e salva
        produto.setQuantidadeAtual(produto.getQuantidadeAtual().subtract(dto.getQuantidade()));
        produtoRepository.save(produto);

        // Cria e grava o registo da movimentação do tipo SAIDA no histórico
        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setTipoMovimentacao("SAIDA");
        movimentacao.setQuantidade(dto.getQuantidade());
        movimentacao.setProduto(produto);
        movimentacao.setUsuario(usuario);

        return movimentacaoRepository.save(movimentacao);
    }
}