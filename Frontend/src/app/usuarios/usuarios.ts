import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html'
})
export class Usuarios implements OnInit {
  
  // Controla a exibição entre a listagem de usuários e o formulário
  telaAtual: 'lista' | 'formulario' = 'lista';
  usuariosDisponiveis: any[] = [];
  usuarioAtual: any = {};

  // Controla a visualização da senha no formulário
  mostrarSenha = false;

  private apiUrl = 'http://api-igor.187.33.201.107.sslip.io/api/usuarios';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Carrega a lista de usuários cadastrados ao abrir a tela
    this.carregarUsuarios();
  }

  // Busca todos os usuários no back-end e ordena pelo ID
  carregarUsuarios(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.usuariosDisponiveis = (dados || []).sort((a, b) => a.id - b.id);
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao buscar usuários:', erro)
    });
  }

  // Verifica se o usuário possui perfil de Administrador
  ehAdmin(u: any): boolean {
    if (!u) return false;
    if (u.usuario === 'admin') return true;
    return u.podeGerenciarUsuarios === true;
  }

  // Abre o formulário em branco com os padrões de Funcionário e Ativo
  abrirNovo(): void {
    this.mostrarSenha = false;
    this.usuarioAtual = {
      nome: '',
      usuario: '',
      senha: '',
      cargo: 'Funcionário',
      ativo: true
    };
    this.telaAtual = 'formulario';
  }

  // Abre o formulário preenchido para editar um usuário existente
  abrirEditar(user: any): void {
    this.mostrarSenha = false;
    this.usuarioAtual = { ...user };
    this.usuarioAtual.cargo = this.ehAdmin(user) ? 'Administrador' : 'Funcionário';
    this.usuarioAtual.ativo = user.ativo !== false;
    this.telaAtual = 'formulario';
  }

  // Retorna para a tabela de usuários
  voltar(): void {
    this.telaAtual = 'lista';
    this.carregarUsuarios();
  }

  // Converte o cargo selecionado nas permissões do banco e salva o usuário
  salvarUsuario(): void {
    const payload = { ...this.usuarioAtual };
    payload.ativo = payload.ativo === true || String(payload.ativo) === 'true';

    // Define as permissões de acordo com o cargo escolhido
    if (payload.cargo === 'Administrador') {
      payload.podeGerenciarProdutos = true;
      payload.podeFazerEntrada = true;
      payload.podeFazerSaida = true;
      payload.podeGerenciarUsuarios = true;
    } else {
      payload.podeGerenciarProdutos = false;
      payload.podeFazerEntrada = true;
      payload.podeFazerSaida = true;
      payload.podeGerenciarUsuarios = false;
    }

    delete payload.cargo;

    this.http.post(this.apiUrl, payload).subscribe({
      next: () => this.voltar(),
      error: (erro) => {
        if (erro.status === 500) {
          alert('Atenção: Este Login (Usuário) já existe no sistema! Por favor, escolha outro.');
        } else {
          console.error('Erro do Java:', erro);
          alert('Erro ao salvar usuário no banco de dados!');
        }
      }
    });
  }
}