// src/app/services/user.service.ts
import { Injectable } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Incluído para registro/login, mas deve ser omitido ao salvar a sessão
}

const USERS_STORAGE_KEY = 'fordAppUsers';
const LOGGED_USER_KEY = 'loggedUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private getUsers(): User[] {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    try {
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
      console.error('Erro ao parsear usuários do localStorage:', e);
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  getLoggedUserSession(): User | null {
    const userString = localStorage.getItem(LOGGED_USER_KEY);
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        console.error('Erro ao parsear sessão do usuário logado:', e);
        return null;
      }
    }
    return null;
  }

  register(user: User): { success: boolean, message: string } {
    const users = this.getUsers();

    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { success: false, message: 'Este email já está registrado.' };
    }

    const newUser: User = {
      id: Date.now(),
      name: user.name,
      email: user.email,
      password: user.password // Note: Na vida real, armazene a senha com hash!
    };

    users.push(newUser);
    this.saveUsers(users);

    return { success: true, message: `Conta criada com sucesso para ${user.name}!` };
  }

  login(email: string, password: string): User | null {
    const users = this.getUsers();

    const foundUser = users.find(user =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
    );

    if (foundUser) {
      // Salva apenas os dados não sensíveis na sessão
      const sessionData = { name: foundUser.name, email: foundUser.email, id: foundUser.id };
      localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(sessionData));
    }

    return foundUser || null;
  }
}