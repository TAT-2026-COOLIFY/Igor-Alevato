import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class ExportarService {

  constructor() { }

  gerarPdf(titulo: string, cabecalhos: string[], dados: any[][], nomeArquivo: string) {
    const pdf = (pdfMake as any).default || pdfMake;
    const fonts = (pdfFonts as any).default || pdfFonts;
    pdf.vfs = fonts.pdfMake ? fonts.pdfMake.vfs : fonts.vfs;

    const dataAtual = new Date().toLocaleString('pt-BR');

    // Ajusta a largura das colunas de acordo com o conteúdo
    const largurasColunas = cabecalhos.map(col => {
      const nomeCol = col.toLowerCase();
      if (nomeCol === 'id') return 45;
      if (
        nomeCol.includes('unidade') || 
        nomeCol.includes('estoque') || 
        nomeCol.includes('mínimo') || 
        nomeCol.includes('quantidade') || 
        nomeCol.includes('status') || 
        nomeCol.includes('tipo')
      ) {
        return 68;
      }
      if (nomeCol.includes('preço') || nomeCol.includes('valor')) return 75;
      return '*'; // Produto, Categoria, Data/Hora e Usuário recebem o espaço maior
    });

    // Formata as células alinhando nomes à esquerda e números/códigos ao centro
    const linhasFormatadas = dados.map(linha =>
      linha.map((celula, index) => {
        const nomeCol = cabecalhos[index]?.toLowerCase() || '';
        const alinhamento = (nomeCol.includes('produto') || nomeCol.includes('nome')) ? 'left' : 'center';
        return {
          text: celula !== null && celula !== undefined ? String(celula) : '-',
          style: 'tableCell',
          alignment: alinhamento
        };
      })
    );

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [30, 35, 30, 45],
      content: [
        // Cabeçalho superior do documento (Apenas título do relatório e dados de geração)
        {
          columns: [
            {
              text: titulo,
              style: 'reportTitle'
            },
            {
              stack: [
                { text: `Gerado em: ${dataAtual}`, style: 'metaInfo' },
                { text: `Total de registros: ${dados.length}`, style: 'metaInfo' }
              ],
              alignment: 'right'
            }
          ],
          margin: [0, 0, 0, 15]
        },

        // Tabela com grades visíveis e linhas zebradas
        {
          table: {
            headerRows: 1,
            widths: largurasColunas,
            body: [
              cabecalhos.map(h => {
                const nomeCol = h.toLowerCase();
                const alinhamento = (nomeCol.includes('produto') || nomeCol.includes('nome')) ? 'left' : 'center';
                return { text: h, style: 'tableHeader', alignment: alinhamento };
              }),
              ...linhasFormatadas
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => {
              if (rowIndex === 0) return '#27272a'; // Cabeçalho escuro
              return (rowIndex % 2 === 0) ? '#f4f4f5' : '#ffffff'; // Linhas alternadas (zebrado)
            },
            hLineWidth: () => 1, // Linha horizontal separando todas as linhas
            vLineWidth: () => 1, // Linha vertical separando todas as colunas
            hLineColor: () => '#d4d4d8', // Cor da borda horizontal
            vLineColor: () => '#d4d4d8', // Cor da borda vertical
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 7,
            paddingBottom: () => 7
          }
        }
      ],
      // Rodapé com paginação automática
      footer: (currentPage: number, pageCount: number) => ({
        columns: [
          { text: 'Relatório Oficial', alignment: 'left', style: 'footerText' },
          { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', style: 'footerText' }
        ],
        margin: [30, 15, 30, 0]
      }),
      styles: {
        reportTitle: { fontSize: 15, bold: true, color: '#18181b', margin: [0, 4, 0, 0] },
        metaInfo: { fontSize: 9, color: '#52525b', margin: [0, 2, 0, 0] },
        tableHeader: { bold: true, fontSize: 10, color: '#ffffff', margin: [0, 2, 0, 2] },
        tableCell: { fontSize: 9.5, color: '#18181b' },
        footerText: { fontSize: 8.5, color: '#71717a' }
      },
      defaultStyle: { fontSize: 10 }
    };

    pdf.createPdf(docDefinition).download(nomeArquivo + '.pdf');
  }
}