import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  
  // Variáveis vinculadas aos campos do formulário de login
  usuario: string = '';
  senha: string = '';
  
  // Controla a exibição do alerta de erro e a visualização da senha
  erroLogin: boolean = false;
  mostrarSenha: boolean = false;

  private apiUrl = 'http://api-igor.187.33.201.107.sslip.io/api/usuarios';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  // Realiza a autenticação do usuário consultando o back-end
  fazerLogin(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (usuariosDoBanco) => {
        
        // Procura um usuário que corresponda ao login e senha informados
        const usuarioValido = usuariosDoBanco.find(
          u => u.usuario === this.usuario && u.senha === this.senha
        );

        // Caso não encontre as credenciais, exibe a mensagem de erro
        if (!usuarioValido) {
          this.erroLogin = true;
          return;
        }

        // Verifica se a conta do usuário está ativa (Regra de Negócio RN05)
        const estaAtivo = usuarioValido.ativo !== false && usuarioValido.statusAtivo !== false;
        if (!estaAtivo) {
          this.erroLogin = true;
          return;
        }

        // Limpa os erros e salva a sessão do usuário no navegador
        this.erroLogin = false;
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioValido));

        // Verifica se o perfil é de Administrador para redirecionar para a tela inicial correta
        const isAdmin =
          usuarioValido.usuario === 'admin' ||
          usuarioValido.podeGerenciarUsuarios === true ||
          String(usuarioValido.cargo?.nome || usuarioValido.cargo || '').toUpperCase().includes('ADMIN');

        if (isAdmin) {
          this.router.navigate(['/visao-geral']);
        } else {
          this.router.navigate(['/categorias']);
        }
      },
      error: (erro) => {
        console.error('Erro ao conectar com o servidor:', erro);
        alert('O servidor (Java) parece estar desligado!');
      }
    });
  }
}