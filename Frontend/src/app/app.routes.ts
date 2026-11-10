import { Routes } from '@angular/router';
import { Categorias } from './categorias/categorias'; 
import { Produtos } from './produtos/produtos';
import { Movimentacoes } from './movimentacoes/movimentacoes';
import { Alertas } from './alertas/alertas';
import { Login } from './login/login';
import { Usuarios } from './usuarios/usuarios';
import { VisaoGeral } from './visao-geral/visao-geral'; 
import { Relatorios } from './relatorios/relatorios';
import { AuthGuard } from './auth.guard'; 

export const routes: Routes = [
  // PORTA DE ENTRADA LIVRE
  { path: 'login', component: Login }, 
  
  // ROTAS TRANCADAS
  { path: 'visao-geral', component: VisaoGeral, canActivate: [AuthGuard] },
  { path: 'categorias', component: Categorias, canActivate: [AuthGuard] }, 
  { path: 'produtos', component: Produtos, canActivate: [AuthGuard] },
  { path: 'movimentacoes', component: Movimentacoes, canActivate: [AuthGuard] },
  { path: 'alertas', component: Alertas, canActivate: [AuthGuard] },
  { path: 'relatorios', component: Relatorios, canActivate: [AuthGuard] },
  { path: 'usuarios', component: Usuarios, canActivate: [AuthGuard] }, 
  
  // REDIRECIONAMENTOS PADRÃO
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } 
];