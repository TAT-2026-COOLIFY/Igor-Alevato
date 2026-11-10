import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-visao-geral',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visao-geral.html'
})
export class VisaoGeral implements OnInit {
  
  // Guarda a data atual do sistema
  dataAtual = new Date();

  // Indicadores de estoque e produtos
  totalProdutos = 0;
  totalEstoqueFisico = 0;
  totalCategorias = 0;
  alertasCriticos = 0;
  valorTotalFormatado = 'R$ 0,00';

  // Indicadores financeiros de saídas (vendas)
  valorVendidoAno = 'R$ 0,00';
  valorVendidoMes = 'R$ 0,00';

  // Referência da instância do Chart.js
  meuGrafico: any;

  private apiBase = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Carrega os contadores dos cartões e os dados do gráfico ao abrir a página
    this.carregarMetricas();
    this.carregarHistoricoReal();
  }

  // Busca as movimentações para calcular os valores vendidos e montar o gráfico anual
  carregarHistoricoReal(): void {
    this.http.get<any[]>(`${this.apiBase}/movimentacoes`).subscribe({
      next: (movimentacoes) => {
        let somaVendaAno = 0;
        let somaVendaMes = 0;

        const anoAtual = this.dataAtual.getFullYear();
        const mesAtual = this.dataAtual.getMonth();

        // Inicializa as listas com 12 posições (Janeiro a Dezembro)
        const valoresEntrada = new Array(12).fill(0);
        const valoresSaida = new Array(12).fill(0);

        // Percorre cada movimentação e soma no mês correspondente
        movimentacoes.forEach(mov => {
          const dataMov = new Date(mov.dataHora);
          const valorFinanceiro = mov.quantidade * (mov.produto?.precoVenda || 0);

          if (dataMov.getFullYear() === anoAtual) {
            const mesDaMovimentacao = dataMov.getMonth();

            if (mov.tipoMovimentacao === 'ENTRADA') {
              valoresEntrada[mesDaMovimentacao] += valorFinanceiro;
            } else if (mov.tipoMovimentacao === 'SAIDA') {
              valoresSaida[mesDaMovimentacao] += valorFinanceiro;
              somaVendaAno += valorFinanceiro;

              if (mesDaMovimentacao === mesAtual) {
                somaVendaMes += valorFinanceiro;
              }
            }
          }
        });

        // Formata os totais financeiros para o padrão de moeda brasileiro (R$)
        this.valorVendidoAno = somaVendaAno.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.valorVendidoMes = somaVendaMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        this.cdr.detectChanges();
        this.desenharGraficoReal(valoresEntrada, valoresSaida);
      },
      error: (erro) => console.error('Erro ao buscar o histórico:', erro)
    });
  }

  // Busca as categorias e produtos para preencher os indicadores de estoque
  carregarMetricas(): void {
    this.http.get<any[]>(`${this.apiBase}/categorias`).subscribe({
      next: (categorias) => {
        this.totalCategorias = categorias.length;
        this.cdr.detectChanges();
      }
    });

    this.http.get<any[]>(`${this.apiBase}/produtos`).subscribe({
      next: (produtos) => {
        this.totalProdutos = produtos.length;

        let somaFisica = 0;
        let somaValor = 0;
        let contadorCritico = 0;

        // Calcula o volume físico total, valor estimado e itens abaixo do mínimo
        produtos.forEach(produto => {
          const qtd = produto.quantidadeAtual || 0;
          const preco = produto.precoVenda || 0;
          const minimo = produto.estoqueMinimo || 0;

          somaFisica += qtd;
          somaValor += (qtd * preco);

          if (qtd <= minimo) {
            contadorCritico++;
          }
        });

        this.totalEstoqueFisico = somaFisica;
        this.alertasCriticos = contadorCritico;
        this.valorTotalFormatado = somaValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.cdr.detectChanges();
      }
    });
  }

  // Renderiza o gráfico de barras comparando Entradas e Saídas mês a mês
  desenharGraficoReal(entradas: number[], saidas: number[]): void {
    const ctx = document.getElementById('graficoVendas') as HTMLCanvasElement;
    if (!ctx) return;

    // Destrói o gráfico anterior caso já exista na tela
    if (this.meuGrafico) {
      this.meuGrafico.destroy();
    }

    this.meuGrafico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
          {
            label: 'Entradas (R$)',
            data: entradas,
            backgroundColor: '#d97706',
            borderRadius: 4
          },
          {
            label: 'Saídas (R$)',
            data: saidas,
            backgroundColor: '#0284c7',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#a1a1aa' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#27272a' },
            ticks: { color: '#a1a1aa' },
            border: { dash: [5, 5], display: false }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#a1a1aa' }
          }
        }
      }
    });
  }
}