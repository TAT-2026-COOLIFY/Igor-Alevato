package com.estoque.backend.service;

import com.estoque.backend.dto.ItemVendaDTO;
import com.estoque.backend.dto.VendaDTO;
import com.estoque.backend.model.*;
import com.estoque.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

// Serviço responsável pelo processamento de vendas, baixa de estoque e cálculo de totais
@Service
public class VendaService {

    // Injeta os repositórios necessários para registar a venda, os itens e a movimentação
    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ItemVendaRepository itemVendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    // Lista todas as vendas registadas no sistema
    public List<Venda> listarTodas() {
        return vendaRepository.findAll();
    }

    // Processa uma nova venda atualizando o estoque e gerando o histórico de saída
    @Transactional
    public Venda realizarVenda(VendaDTO dto) {
        // Procura o usuário responsável pela realização da venda
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        // Inicializa e guarda o cabeçalho da venda principal
        Venda venda = new Venda();
        venda.setUsuario(usuario);
        venda.setValorTotal(BigDecimal.ZERO);
        venda = vendaRepository.save(venda);

        BigDecimal valorTotalCalculado = BigDecimal.ZERO;

        // Percorre cada item da venda para validar estoque, calcular subtotais e dar baixa
        for (ItemVendaDTO itemDto : dto.getItens()) {
            Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

            // Regra de Negócio RN03: verifica se há saldo suficiente antes de concluir a venda
            if (produto.getQuantidadeAtual().compareTo(itemDto.getQuantidade()) < 0) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            // Calcula o subtotal do item (preço unitário multiplicado pela quantidade)
            BigDecimal subtotal = itemDto.getPrecoUnitario().multiply(itemDto.getQuantidade());
            valorTotalCalculado = valorTotalCalculado.add(subtotal);

            // Regista o item individual vinculado à venda
            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setVenda(venda);
            itemVenda.setProduto(produto);
            itemVenda.setQuantidade(itemDto.getQuantidade());
            itemVenda.setPrecoUnitario(itemDto.getPrecoUnitario());
            itemVenda.setSubtotal(subtotal);
            itemVendaRepository.save(itemVenda);

            // Desconta a quantidade vendida do saldo atual do produto no estoque
            produto.setQuantidadeAtual(produto.getQuantidadeAtual().subtract(itemDto.getQuantidade()));
            produtoRepository.save(produto);

            // Regista automaticamente a movimentação de SAIDA no histórico para os relatórios
            Movimentacao movimentacao = new Movimentacao();
            movimentacao.setTipoMovimentacao("SAIDA");
            movimentacao.setQuantidade(itemDto.getQuantidade());
            movimentacao.setProduto(produto);
            movimentacao.setUsuario(usuario);
            movimentacaoRepository.save(movimentacao);
        }

        // Atualiza o valor total consolidado da venda e guarda no banco de dados
        venda.setValorTotal(valorTotalCalculado);
        return vendaRepository.save(venda);
    }
}