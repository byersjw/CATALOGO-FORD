// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Define a estrutura do usuário que está no localStorage
interface LoggedUser {
  name: string;
  email: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  /**
   * Obtém o usuário logado e redireciona se não houver.
   * @returns O objeto LoggedUser ou null.
   */
  getAndVerifyLoggedUser(): LoggedUser | null {
    const userString = localStorage.getItem('loggedUser');
    
    if (!userString) {
      // Redireciona para o login (simulando 'window.location.href = login.html')
      this.router.navigate(['/login']);
      return null;
    }

    try {
      return JSON.parse(userString) as LoggedUser;
    } catch (e) {
      console.error('Erro ao fazer parse do usuário logado:', e);
      this.router.navigate(['/login']);
      return null;
    }
  }

  /**
   * Realiza o processo de logout, limpando a sessão.
   */
  logout() {
    // Implementa a lógica do 'confirm' e 'localStorage.removeItem'
    if (window.confirm('Deseja realmente sair do sistema?')) {
      localStorage.removeItem('loggedUser');
      // Redireciona para a rota de login
      this.router.navigate(['/login']); 

      
    }
  }
}