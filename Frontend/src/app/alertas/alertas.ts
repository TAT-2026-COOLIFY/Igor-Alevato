import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService, Produto } from '../services/produto';
import { ExportarService } from '../services/exportar.service';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alertas.html'
})
export class Alertas implements OnInit {
  
  // Listas de produtos críticos e categorias para o filtro
  produtos: Produto[] = [];
  categoriasDisponiveis: any[] = [];

  // Campos de pesquisa da barra superior
  filtroCategoria: string = '';
  filtroNome: string = '';
  filtroId: string = '';

  constructor(
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef,
    private exportarService: ExportarService
  ) {}

  ngOnInit(): void {
    // Busca as categorias e os produtos com estoque baixo ao iniciar a tela
    this.carregarCategorias();
    this.carregarAlertas();
  }

  // Carrega a lista de categorias para preencher o seletor de filtro
  carregarCategorias(): void {
    this.produtoService.listarCategorias().subscribe({
      next: (dados) => {
        this.categoriasDisponiveis = dados || [];
      },
      error: (erro) => console.error('Erro ao buscar categorias:', erro)
    });
  }

  // Busca no back-end apenas os produtos com quantidade menor ou igual ao estoque mínimo
  carregarAlertas(): void {
    this.produtoService.listarProdutosComEstoqueBaixo().subscribe({
      next: (dados) => {
        this.produtos = (dados || []).sort((a, b) => (a.id || 0) - (b.id || 0));
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao buscar alertas no Java:', erro)
    });
  }

  // Filtra os produtos em alerta conforme a categoria, nome ou ID digitados
  get produtosFiltrados(): Produto[] {
    return this.produtos.filter(p => {
      const bateCategoria = this.filtroCategoria === '' || p.categoria?.nome === this.filtroCategoria;
      const bateNome = this.filtroNome === '' || p.nome?.toLowerCase().includes(this.filtroNome.toLowerCase());
      const bateId = this.filtroId === '' || p.id?.toString().includes(this.filtroId);

      return bateCategoria && bateNome && bateId;
    });
  }

  // Gera e baixa o arquivo PDF com a lista de produtos em estado crítico
  exportarPdfAlertas(): void {
    const cabecalhos = ['ID', 'Produto', 'Categoria', 'Estoque Atual', 'Estoque Mínimo'];

    const dados = this.produtosFiltrados.map(p => [
      `#${p.id}`,
      p.nome,
      p.categoria?.nome || 'Sem Categoria',
      p.quantidadeAtual?.toString() || '0',
      p.estoqueMinimo?.toString() || '0'
    ]);

    this.exportarService.gerarPdf(
      'Relatório: Produtos com Estoque Baixo',
      cabecalhos,
      dados,
      'relatorio_estoque_baixo'
    );
  }
}