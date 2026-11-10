import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProdutoService, Produto } from '../services/produto';

@Component({
  selector: 'app-movimentacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movimentacoes.html'
})
export class Movimentacoes implements OnInit {
  
  // Controla qual tela está ativa (seleção inicial, entrada ou saída)
  telaAtual: 'botoes' | 'entrada' | 'saida' = 'botoes';

  // Listas de produtos e categorias
  produtosDisponiveis: Produto[] = [];
  produtosExibidos: Produto[] = [];
  categoriasDisponiveis: any[] = [];
  categoriaSelecionada = 'Todos';

  // Filtros de pesquisa do catálogo
  termoPesquisa: string = '';
  idPesquisa: number | null = null;

  // Dados da lista de movimentação (carrinho)
  carrinho: any[] = [];
  totalCarrinho: number = 0;
  totalItens: number = 0;

  // Controle da notificação flutuante de sucesso ou erro
  mensagemNotificacao: string = '';
  tipoNotificacao: 'success' | 'danger' = 'success';

  private apiMovimentacoes = 'http://localhost:8080/api/movimentacoes';

  constructor(
    private produtoService: ProdutoService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Carrega as categorias e os produtos disponíveis ao iniciar o componente
    this.carregarCategorias();
    this.carregarProdutos();
  }

  // Exibe um alerta temporário de 3 segundos no canto superior direito
  mostrarNotificacao(tipo: 'success' | 'danger', mensagem: string): void {
    this.tipoNotificacao = tipo;
    this.mensagemNotificacao = mensagem;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.mensagemNotificacao = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  // Busca as categorias para preencher o filtro do catálogo
  carregarCategorias(): void {
    this.produtoService.listarCategorias().subscribe({
      next: (dados) => {
        if (dados && dados.length > 0) {
          this.categoriasDisponiveis = dados;
        }
      },
      error: (erro) => console.error('Erro ao buscar categorias:', erro)
    });
  }

  // Busca os produtos atualizados e aplica a ordenação padrão
  carregarProdutos(): void {
    this.produtoService.listarProdutos().subscribe(dados => {
      this.produtosDisponiveis = dados || [];
      this.aplicarFiltros();
    });
  }

  // Abre o painel no modo de Saída de Estoque (Vendas)
  abrirSaida(): void {
    this.telaAtual = 'saida';
    this.limparCarrinho();
  }

  // Abre o painel no modo de Entrada de Estoque (Recepção)
  abrirEntrada(): void {
    this.telaAtual = 'entrada';
    this.limparCarrinho();
  }

  // Volta para a tela dos dois cartões principais
  voltar(): void {
    this.telaAtual = 'botoes';
    this.limparCarrinho();
  }

  // Esvazia a lista de itens selecionados e zera os totais
  limparCarrinho(): void {
    this.carrinho = [];
    this.atualizarTotais();
  }

  // Filtra o catálogo por categoria, nome ou ID e ordena por Categoria e Nome
  aplicarFiltros(): void {
    const filtrados = this.produtosDisponiveis.filter(p => {
      const passaCategoria = this.categoriaSelecionada === 'Todos' || p.categoria?.nome === this.categoriaSelecionada;
      const passaNome = this.termoPesquisa.trim() === '' || p.nome.toLowerCase().includes(this.termoPesquisa.toLowerCase());
      const passaId = this.idPesquisa === null || this.idPesquisa.toString() === '' || p.id === this.idPesquisa;

      return passaCategoria && passaNome && passaId;
    });

    filtrados.sort((a, b) => {
      const catA = (a.categoria?.nome || '').toLowerCase();
      const catB = (b.categoria?.nome || '').toLowerCase();
      if (catA < catB) return -1;
      if (catA > catB) return 1;

      const nomeA = (a.nome || '').toLowerCase();
      const nomeB = (b.nome || '').toLowerCase();
      if (nomeA < nomeB) return -1;
      if (nomeA > nomeB) return 1;
      return 0;
    });

    this.produtosExibidos = filtrados;
  }

  // Adiciona o produto clicado à lista lateral ou incrementa sua quantidade
  adicionarAoCarrinho(produto: Produto): void {
    const itemExistente = this.carrinho.find(item => item.produto.id === produto.id);
    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      this.carrinho.push({ produto: produto, quantidade: 1 });
    }
    this.atualizarTotais();
  }

  // Aumenta em 1 unidade a quantidade do item na lista
  aumentarQuantidade(item: any): void {
    item.quantidade++;
    this.atualizarTotais();
  }

  // Diminui em 1 unidade ou remove o item caso chegue a zero
  diminuirQuantidade(item: any): void {
    if (item.quantidade > 1) {
      item.quantidade--;
    } else {
      this.removerDoCarrinho(item);
    }
    this.atualizarTotais();
  }

  // Remove um produto específico da lista lateral
  removerDoCarrinho(item: any): void {
    this.carrinho = this.carrinho.filter(i => i !== item);
    this.atualizarTotais();
  }

  // Recalcula a quantidade total de itens e o valor financeiro total
  atualizarTotais(): void {
    this.totalCarrinho = this.carrinho.reduce((acc, item) => acc + ((item.produto.precoVenda || 0) * item.quantidade), 0);
    this.totalItens = this.carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  }

  // Impede quantidades negativas ou vazias ao digitar manualmente
  validarQuantidade(item: any): void {
    if (item.quantidade === null || item.quantidade <= 0 || isNaN(item.quantidade)) {
      item.quantidade = 1;
    }
    this.atualizarTotais();
  }

  // Registra todas as entradas ou saídas da lista no banco de dados
  finalizarMovimentacao(): void {
    if (this.carrinho.length === 0) return;

    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    let usuarioId = 1;

    if (usuarioSalvo) {
      const usuarioLogado = JSON.parse(usuarioSalvo);
      usuarioId = usuarioLogado.id;
    }

    let requisicoesCompletadas = 0;
    const rota = this.telaAtual === 'entrada' ? 'entrada' : 'saida';

    this.carrinho.forEach(item => {
      const dto = {
        produtoId: item.produto.id,
        usuarioId: usuarioId,
        quantidade: item.quantidade
      };

      this.http.post(`${this.apiMovimentacoes}/${rota}`, dto).subscribe({
        next: () => {
          requisicoesCompletadas++;
          if (requisicoesCompletadas === this.carrinho.length) {
            const msg = this.telaAtual === 'entrada'
              ? 'Entrada registrada com sucesso no Histórico!'
              : 'Saída registrada com sucesso no Histórico!';
            this.mostrarNotificacao('success', msg);
            this.carrinho = [];
            this.carregarProdutos();
            this.voltar();
            this.cdr.detectChanges();
          }
        },
        error: (erro) => {
          console.error('Erro na movimentação:', erro);
          const msgErro = this.telaAtual === 'entrada'
            ? `Erro ao registrar entrada do produto: ${item.produto.nome}`
            : `Erro ao registrar saída de: ${item.produto.nome}. Verifique se há estoque.`;
          this.mostrarNotificacao('danger', msgErro);
        }
      });
    });
  }
}