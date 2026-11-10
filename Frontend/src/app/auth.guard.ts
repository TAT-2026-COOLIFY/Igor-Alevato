import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verifica se existe alguém logado salvo na memória (caso sim, está no navegador)
    if (typeof window !== 'undefined' && window.localStorage) {
      const usuarioSalvo = localStorage.getItem('usuarioLogado');

      if (usuarioSalvo) {
        return true; // Tem usuário salvo, então deixa passar!
      }
    }

    // Se não tiver usuário ou se bater direto, chuta de volta para o login
    this.router.navigate(['/login']);
    return false;
  }
}