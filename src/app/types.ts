// src/app/types.ts

/**
 * Interface que representa a estrutura de um usuário logado
 * Armazenado no localStorage sob a chave 'loggedUser'.
 */
export interface LoggedUser {
  name: string;
  email: string;
  id: number;
}

// Se você precisar da estrutura completa (com senha) para o serviço de registro:
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // A senha é opcional/omitida em alguns contextos
}