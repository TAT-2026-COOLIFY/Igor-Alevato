import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html'
})
export class App {
  
  // Controla se a barra lateral deve ser exibida ou ocultada
  mostrarMenu: boolean = true;

  constructor(private router: Router) {
    // Escuta as mudanças de rota para esconder o menu quando estiver na tela de login
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.mostrarMenu = !event.urlAfterRedirects.includes('/login');
      }
    });
  }

  // Busca os dados do usuário autenticado salvos no armazenamento local do navegador
  get usuarioLogado(): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const salvo = localStorage.getItem('usuarioLogado');
      return salvo ? JSON.parse(salvo) : null;
    }
    return null;
  }

  // Verifica se o usuário logado possui permissões de Administrador (Gerente)
  get ehAdministrador(): boolean {
    const user = this.usuarioLogado;
    if (!user) return false;

    // Libera caso seja o login principal ou possua a permissão de gerenciar usuários
    if (user.usuario === 'admin' || user.podeGerenciarUsuarios === true) {
      return true;
    }

    // Fallback: verifica pelo nome do cargo caso venha preenchido como texto ou objeto
    const cargo = String(user.cargo?.nome || user.cargo || '').toUpperCase();
    return cargo.includes('ADMIN');
  }

  // Remove a sessão do usuário do armazenamento local e redireciona para o login
  sair(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('usuarioLogado');
    }
    this.router.navigate(['/login']);
  }
}