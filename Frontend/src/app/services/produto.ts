import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  nome: string;
  categoria?: any;
  tipoUnidade?: string;
  precoVenda?: number;
  estoqueMinimo?: number;
  quantidadeAtual?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrlProdutos = 'http://api-igor.187.33.201.107.sslip.io/api/produtos';
  private apiUrlCategorias = 'http://api-igor.187.33.201.107.sslip.io/api/categorias';

  constructor(private http: HttpClient) {}

  // ==========================================
  // COMANDOS DE PRODUTOS
  // ==========================================
  listarProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrlProdutos);
  }

  cadastrarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrlProdutos, produto);
  }

  atualizarProduto(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrlProdutos}/${produto.id}`, produto);
  }

  excluirProduto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlProdutos}/${id}`);
  }

  // ==========================================
  // COMANDOS DE CATEGORIAS
  // ==========================================
  listarCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlCategorias);
  }

  cadastrarCategoria(categoria: any): Observable<any> {
    return this.http.post<any>(this.apiUrlCategorias, categoria);
  }

  // AQUI ESTÃO AS DUAS FUNÇÕES QUE VÃO APAGAR O ERRO VERMELHO:
  atualizarCategoria(categoria: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrlCategorias}/${categoria.id}`, categoria);
  }

  excluirCategoria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlCategorias}/${id}`);
  }
  // BUSCAR PRODUTOS COM ESTOQUE BAIXO (Para a tela de Alertas)
  listarProdutosComEstoqueBaixo(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrlProdutos}/estoque-baixo`);
  }
}