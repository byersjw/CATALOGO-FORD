// src/app/pages/home/home.component.ts
import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink} from '@angular/router'; // Para navegação
import { AuthService } from '../../services/auth.service'; // Importa o serviço

// Declaração para o Feather Icons (se estiver carregado globalmente)
declare var feather: any;

@Component({
  selector: 'app-home',
  // O componente precisa ser standalone ou importado em um módulo
  standalone: true, 
  imports: [CommonModule, RouterLink], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements OnInit, AfterViewInit {
  private authService = inject(AuthService);

  // Variáveis de Estado (State Variables)
  welcomeMessage: string = 'Bem-vindo(a)';
  isSidebarCollapsed: boolean = false;

  ngOnInit(): void {
    // 1. Proteção de página e Personalização (Lógica do script)
    const loggedUser = this.authService.getAndVerifyLoggedUser();

    if (loggedUser) {
      // Exibe o primeiro nome do usuário logado
      const firstName = loggedUser.name.split(' ')[0];
      this.welcomeMessage = `Bem-vindo(a), ${firstName}`;
    }
    // Se loggedUser for null, o AuthService já redirecionou.
  }

  ngAfterViewInit(): void {
    // 2. Substitui os Feather Icons após a renderização da view
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  /**
   * 3. Toggle sidebar no mobile e ajuste de classes Tailwind
   * (Lógica que manipula os elementos e classes no script)
   */
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;

    // Manipulação do 'main-content' para ajustar margem, simulando Tailwind
    // Nota: Em Angular, o ideal é usar NgClass diretamente no template,
    // mas mantive a lógica de manipulação direta de classes para replicar 
    // o comportamento do script original que usa 'md:ml-64' e 'md:ml-20'.
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    
    if (mainContent) {
        if (this.isSidebarCollapsed) {
            mainContent.classList.remove('md:ml-64');
            mainContent.classList.add('md:ml-20');
        } else {
            mainContent.classList.remove('md:ml-20');
            mainContent.classList.add('md:ml-64');
        }
    }
  }

  /**
   * 4. Logout funcional
   */
  onLogout(): void {
    this.authService.logout();
  }
}
