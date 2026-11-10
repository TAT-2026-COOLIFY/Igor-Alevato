import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService, Produto } from '../services/produto';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.html'
})
export class Produtos implements OnInit {
  
  // Controla a exibição entre a tabela de produtos e o formulário de cadastro
  telaAtual: 'lista' | 'formulario' = 'lista';
  produtos: Produto[] = [];

  // Objeto do produto em criação ou edição
  produtoAtual: any = { categoria: null };
  categoriasDisponiveis: any[] = [];

  // Campos de filtro da barra superior
  filtroCategoria: string = '';
  filtroNome: string = '';
  filtroId: string = '';

  // Controle do modal de confirmação de exclusão
  exibirModalExclusao: boolean = false;
  produtoParaExcluir: Produto | null = null;
  erroExclusao: string = '';

  constructor(
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Carrega as categorias e a lista de produtos ao abrir a página
    this.carregarCategorias();
    this.carregarProdutos();
  }

  // Busca todas as categorias cadastradas para preencher os seletores
  carregarCategorias(): void {
    this.produtoService.listarCategorias().subscribe({
      next: (dados) => {
        this.categoriasDisponiveis = dados || [];
      },
      error: (erro) => console.error('Erro ao buscar categorias:', erro)
    });
  }

  // Busca todos os produtos cadastrados no banco de dados
  carregarProdutos(): void {
    this.produtoService.listarProdutos().subscribe({
      next: (dados) => {
        this.produtos = dados || [];
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao buscar produtos:', erro)
    });
  }

  // Filtra os produtos pesquisados e ordena por Categoria (A-Z) e Nome (A-Z)
  get produtosFiltrados(): Produto[] {
    const filtrados = this.produtos.filter(p => {
      const bateCategoria = this.filtroCategoria === '' || p.categoria?.nome === this.filtroCategoria;
      const bateNome = this.filtroNome === '' || p.nome?.toLowerCase().includes(this.filtroNome.toLowerCase());
      const bateId = this.filtroId === '' || p.id?.toString().includes(this.filtroId);

      return bateCategoria && bateNome && bateId;
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

    return filtrados;
  }

  // Abre o formulário vazio para cadastrar um novo produto
  abrirNovo(): void {
    this.produtoAtual = { categoria: null, quantidadeAtual: 0 };
    this.telaAtual = 'formulario';
  }

  // Abre o formulário preenchido com os dados do produto selecionado
  abrirEditar(produto: Produto): void {
    this.produtoAtual = { ...produto };
    this.telaAtual = 'formulario';
  }

  // Volta do formulário para a listagem de produtos
  voltar(): void {
    this.telaAtual = 'lista';
    this.carregarProdutos();
  }

  // Compara os IDs das categorias para manter o select preenchido na edição
  compararCategorias(cat1: any, cat2: any): boolean {
    return cat1 && cat2 ? cat1.id === cat2.id : cat1 === cat2;
  }

  // Valida e salva o produto (criação ou atualização) no back-end
  salvarProduto(): void {
    if (this.produtoAtual.estoqueMinimo < 0 || this.produtoAtual.precoVenda < 0) return;

    if (this.produtoAtual.quantidadeAtual === undefined) {
      this.produtoAtual.quantidadeAtual = 0;
    }

    if (!this.produtoAtual.id) {
      this.produtoService.cadastrarProduto(this.produtoAtual).subscribe({
        next: () => this.voltar(),
        error: () => alert('Erro ao salvar no banco!')
      });
    } else {
      this.produtoService.atualizarProduto(this.produtoAtual).subscribe({
        next: () => this.voltar(),
        error: () => alert('Erro ao atualizar produto no banco!')
      });
    }
  }

  // Abre o modal de confirmação para excluir o produto selecionado
  abrirModalExcluir(produto: Produto): void {
    this.produtoParaExcluir = produto;
    this.erroExclusao = '';
    this.exibirModalExclusao = true;
  }

  // Fecha o modal de exclusão e limpa a seleção
  fecharModalExclusao(): void {
    this.exibirModalExclusao = false;
    this.produtoParaExcluir = null;
    this.erroExclusao = '';
  }

  // Solicita a exclusão do produto ao back-end e trata restrições de histórico
  confirmarExclusao(): void {
    if (!this.produtoParaExcluir || !this.produtoParaExcluir.id) return;

    this.produtoService.excluirProduto(this.produtoParaExcluir.id).subscribe({
      next: () => {
        this.fecharModalExclusao();
        this.carregarProdutos();
      },
      error: () => {
        this.erroExclusao = 'Não foi possível excluir este produto pois ele já possui movimentações registradas no histórico.';
        this.cdr.detectChanges();
      }
    });
  }
}