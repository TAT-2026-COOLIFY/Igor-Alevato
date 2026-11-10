import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../services/produto';
import { ExportarService } from '../services/exportar.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html'
})
export class Categorias implements OnInit {
  
  // Listas principais de categorias e produtos
  categoriasDisponiveis: any[] = [];
  todosProdutos: any[] = [];
  totalGeralProdutos = 0;

  // Controle de alternância entre os cartões de categorias e a tabela de produtos
  telaAtual: 'cards' | 'catalogo' = 'cards';
  nomeCategoriaAberta: string = '';

  // Listas auxiliares para filtragem de produtos dentro da categoria
  produtosCategoriaOriginal: any[] = [];
  produtosExibidosCatalogo: any[] = [];

  // Campos de pesquisa
  termoPesquisa: string = '';
  idPesquisa: string = '';

  // Controle do modal de criação e edição de categoria
  exibirModal: boolean = false;
  categoriaAtual: any = { id: null, nome: '' };
  modoEdicao: boolean = false;

  // Controle do modal de confirmação de exclusão
  exibirModalExclusao: boolean = false;
  categoriaParaExcluir: any = null;
  erroExclusaoCategoria: string = '';

  constructor(
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef,
    private exportarService: ExportarService
  ) {}

  // Verifica se o usuário autenticado possui permissão de Administrador
  get ehAdministrador(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const str = localStorage.getItem('usuarioLogado');
    if (!str) return false;
    const user = JSON.parse(str);

    if (user.usuario === 'admin' || user.podeGerenciarUsuarios === true) return true;
    const cargo = String(user.cargo?.nome || user.cargo || '').toUpperCase();
    return cargo.includes('ADMIN');
  }

  ngOnInit(): void {
    // Carrega todas as categorias e produtos ao iniciar a tela
    this.carregarDados();
  }

  // Fecha o menu de opções (3 pontinhos) ao clicar em qualquer lugar fora dele
  @HostListener('document:click')
  fecharMenusGlobais(): void {
    this.categoriasDisponiveis.forEach(c => c.menuAberto = false);
  }

  // Busca categorias e calcula a quantidade de produtos vinculados a cada uma
  carregarDados(): void {
    this.produtoService.listarCategorias().subscribe({
      next: (cats) => {
        this.categoriasDisponiveis = cats || [];

        this.produtoService.listarProdutos().subscribe({
          next: (prods) => {
            this.todosProdutos = prods || [];
            this.totalGeralProdutos = this.todosProdutos.length;

            this.categoriasDisponiveis = this.categoriasDisponiveis.map(c => {
              const quantidade = this.todosProdutos.filter(p => p.categoria && p.categoria.id === c.id).length;
              return { ...c, quantidadeProdutos: quantidade, menuAberto: false };
            });

            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Erro ao buscar produtos:', err);
            this.cdr.detectChanges();
          }
        });
      },
      error: (erro) => console.error('Erro ao carregar categorias do Java:', erro)
    });
  }

  // Abre a tabela de produtos correspondente ao cartão de categoria clicado
  abrirCatalogo(cat: any): void {
    this.termoPesquisa = '';
    this.idPesquisa = '';

    if (cat === 'Todos') {
      this.nomeCategoriaAberta = 'Todos';
      this.produtosCategoriaOriginal = this.todosProdutos;
    } else {
      this.nomeCategoriaAberta = cat.nome;
      this.produtosCategoriaOriginal = this.todosProdutos.filter(p => p.categoria && p.categoria.id === cat.id);
    }

    this.produtosExibidosCatalogo = [...this.produtosCategoriaOriginal];
    this.aplicarFiltros();
    this.telaAtual = 'catalogo';
  }

  // Filtra os produtos por nome ou ID e ordena por Categoria (A-Z) e Nome (A-Z)
  aplicarFiltros(): void {
    const filtrados = this.produtosCategoriaOriginal.filter(p => {
      const bateNome = this.termoPesquisa === '' || p.nome?.toLowerCase().includes(this.termoPesquisa.toLowerCase());
      const bateId = this.idPesquisa === '' || this.idPesquisa === null || p.id?.toString().includes(this.idPesquisa.toString());
      return bateNome && bateId;
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

    this.produtosExibidosCatalogo = filtrados;
  }

  // Retorna da tabela de produtos para a visualização de cartões
  voltarParaCards(): void {
    this.telaAtual = 'cards';
  }

  // Abre ou fecha o menu suspenso de edição/exclusão do cartão da categoria
  alternarMenu(cat: any, event: Event): void {
    event.stopPropagation();
    const estadoAtual = cat.menuAberto;
    this.categoriasDisponiveis.forEach(c => c.menuAberto = false);
    cat.menuAberto = !estadoAtual;
  }

  // Abre o modal limpo para cadastrar uma nova categoria
  abrirModalNovo(): void {
    this.categoriaAtual = { id: null, nome: '' };
    this.modoEdicao = false;
    this.exibirModal = true;
  }

  // Abre o modal preenchido para editar o nome da categoria selecionada
  abrirModalEditar(cat: any, event: Event): void {
    event.stopPropagation();
    cat.menuAberto = false;
    this.categoriaAtual = { ...cat };
    this.modoEdicao = true;
    this.exibirModal = true;
  }

  // Fecha o modal de cadastro/edição
  fecharModal(): void {
    this.exibirModal = false;
  }

  // Envia a nova categoria ou a alteração para o back-end
  salvarCategoriaModal(): void {
    if (!this.categoriaAtual.nome || this.categoriaAtual.nome.trim() === '') return;

    const dadosParaEnviar = {
      id: this.categoriaAtual.id,
      nome: this.categoriaAtual.nome.trim()
    };

    if (this.modoEdicao) {
      this.produtoService.atualizarCategoria(dadosParaEnviar).subscribe({
        next: () => {
          this.fecharModal();
          this.carregarDados();
        }
      });
    } else {
      this.produtoService.cadastrarCategoria({ nome: dadosParaEnviar.nome }).subscribe({
        next: () => {
          this.fecharModal();
          this.carregarDados();
        }
      });
    }
  }

  // Abre o modal de exclusão e verifica se existem produtos vinculados à categoria
  excluirCategoria(cat: any, event: Event): void {
    event.stopPropagation();
    cat.menuAberto = false;
    this.categoriaParaExcluir = cat;

    if (cat.quantidadeProdutos > 0) {
      this.erroExclusaoCategoria = `Ação negada: Existem ${cat.quantidadeProdutos} produto(s) vinculados à categoria "${cat.nome}".`;
    } else {
      this.erroExclusaoCategoria = '';
    }
    this.exibirModalExclusao = true;
  }

  // Fecha o modal de confirmação de exclusão
  fecharModalExclusao(): void {
    this.exibirModalExclusao = false;
    this.categoriaParaExcluir = null;
    this.erroExclusaoCategoria = '';
  }

  // Executa a exclusão da categoria no banco de dados
  confirmarExclusaoCategoria(): void {
    if (!this.categoriaParaExcluir) return;

    this.produtoService.excluirCategoria(this.categoriaParaExcluir.id).subscribe({
      next: () => {
        this.fecharModalExclusao();
        this.carregarDados();
      },
      error: () => {
        this.erroExclusaoCategoria = 'Erro ao excluir a categoria.';
        this.cdr.detectChanges();
      }
    });
  }

  // Exporta a tabela de produtos da categoria aberta para PDF
  exportarPdfCategoria(): void {
    const cabecalhos = ['ID', 'Produto', 'Unidade', 'Estoque', 'Preço'];
    const dados = this.produtosExibidosCatalogo.map(p => [
      `#${p.id}`,
      p.nome,
      p.tipoUnidade || '-',
      p.quantidadeAtual?.toString() || '0',
      `R$ ${p.precoVenda}`
    ]);

    this.exportarService.gerarPdf(
      `Relatório de Estoque - Categoria: ${this.nomeCategoriaAberta}`,
      cabecalhos,
      dados,
      `estoque_${this.nomeCategoriaAberta.toLowerCase()}`
    );
  }
}