import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ExportarService } from '../services/exportar.service';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorios.html'
})
export class Relatorios implements OnInit {
  
  // Armazena a lista de movimentações de entrada e saída
  movimentacoes: any[] = [];

  private apiUrl = 'http://localhost:8080/api/movimentacoes';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private exportarService: ExportarService
  ) {}

  ngOnInit(): void {
    // Carrega o histórico completo ao abrir a tela
    this.carregarHistorico();
  }

  // Consulta o histórico no back-end e ordena da mais recente para a mais antiga
  carregarHistorico(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.movimentacoes = (dados || []).reverse();
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao buscar o relatório:', erro)
    });
  }

  // Formata os registros do histórico e exporta para o arquivo PDF
  exportarPdfMovimentacoes(): void {
    const cabecalhos = ['Data e Hora', 'Tipo', 'Produto', 'Quantidade', 'Usuário'];

    const dados = this.movimentacoes.map(mov => {
      const dataObj = new Date(mov.dataHora);
      const dataFormatada = `${dataObj.toLocaleDateString('pt-BR')} ${dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

      return [
        dataFormatada,
        mov.tipoMovimentacao,
        mov.produto?.nome || 'N/A',
        mov.quantidade.toString(),
        mov.usuario?.nome || 'Sistema'
      ];
    });

    this.exportarService.gerarPdf(
      'Relatório de Movimentações',
      cabecalhos,
      dados,
      'relatorio_movimentacoes'
    );
  }
}