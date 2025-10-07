// src/app/pages/login/login.component.ts
import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Importa o serviço que criamos
import { UserService } from '../../services/user.service';

// Necessário para o Feather Icons, idealmente substituído por um ícone Angular
declare var feather: any;

@Component({
  selector: 'app-login',
  // O componente precisa ser standalone ou importado em um módulo
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Estados
  isRegisterMode: boolean = false;
  isTermsModalOpen: boolean = false;
  message: { text: string, type: 'success' | 'error' | null } = { text: '', type: null };

  // Reactive Forms
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  ngOnInit(): void {
    // 1. Verifica se já está logado e redireciona (Lógica do window.onload)
    if (this.userService.getLoggedUserSession()) {
      // Redireciona para a rota da home (o nome real da sua rota, ex: /home)
      this.router.navigate(['/home']); 
    }

    // Inicializa o formulário de Login
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]], // email = username
      password: ['', Validators.required],
      terms: [false, Validators.requiredTrue] // Deve ser true
    });

    // Inicializa o formulário de Registro
    this.registerForm = this.fb.group({
      regName: ['', Validators.required],
      regEmail: ['', [Validators.required, Validators.email]],
      regPassword: ['', [Validators.required, Validators.minLength(6)]],
      regConfirmPassword: ['', Validators.required],
      regTerms: [false, Validators.requiredTrue]
    }, {
      // Adiciona um validador customizado para comparar senhas no registro
      validators: this.passwordMatchValidator
    });
  }

  ngAfterViewInit(): void {
    // 2. Chama a substituição dos Feather Icons após a view ser inicializada
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  // --- Funções de Utilitário ---

  // Validador Customizado para Senhas (Angular Reactive Forms)
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('regPassword')?.value;
    const confirmPassword = g.get('regConfirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  showMessage(text: string, type: 'success' | 'error'): void {
    this.message = { text, type };
    setTimeout(() => {
      this.message = { text: '', type: null };
    }, 5000);
  }

  // --- Lógica de Toggle de Formulários ---

  toggleMode(toRegister: boolean): void {
    this.isRegisterMode = toRegister;
    this.message = { text: '', type: null }; // Limpa a mensagem ao trocar
    this.registerForm.reset({ regTerms: false }); // Limpa o formulário de registro
    this.registerForm.markAsUntouched(); // Marca como intocado
  }

  // --- Lógica do Modal de Termos ---

  openTermsModal(e: Event): void {
    e.preventDefault();
    this.isTermsModalOpen = true;
  }

  closeTermsModal(): void {
    this.isTermsModalOpen = false;
  }

  acceptTerms(): void {
    this.loginForm.get('terms')?.setValue(true);
    this.registerForm.get('regTerms')?.setValue(true);
    this.closeTermsModal();
  }

  // --- Lógica de Registro (Submit) ---

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.showMessage('Por favor, preencha todos os campos corretamente e aceite os Termos.', 'error');
      this.registerForm.markAllAsTouched(); // Mostra erros de validação
      return;
    }
    
    // Verifica a validação do Password Match
    if (this.registerForm.errors?.['mismatch']) {
        this.showMessage('As senhas não coincidem. Por favor, verifique novamente.', 'error');
        return;
    }

    const formValue = this.registerForm.value;
    const registrationResult = this.userService.register({
        id: 0, // será sobrescrito pelo serviço
        name: formValue.regName,
        email: formValue.regEmail,
        password: formValue.regPassword
    });

    if (registrationResult.success) {
      this.showMessage(registrationResult.message + ' Agora faça o login.', 'success');
      
      // Volta para o login e preenche o email (Lógica do script original)
      this.toggleMode(false);
      this.loginForm.get('username')?.setValue(formValue.regEmail);

    } else {
      this.showMessage(registrationResult.message, 'error');
    }
  }

  // --- Lógica de Login (Submit) ---

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      // A validação 'terms' é importante
      if (!this.loginForm.get('terms')?.value) {
        this.showMessage('Você deve aceitar os Termos e Condições para entrar.', 'error');
      } else {
        this.showMessage('Por favor, preencha o email e senha corretamente.', 'error');
        this.loginForm.markAllAsTouched();
      }
      return;
    }

    const formValue = this.loginForm.value;
    const user = this.userService.login(formValue.username, formValue.password);

    if (user) {
      this.showMessage(`Login bem-sucedido! Bem-vindo(a), ${user.name}. Redirecionando...`, 'success');

      // Redirecionamento após 1 segundo (Lógica do script original)
      setTimeout(() => {
        this.router.navigate(['/home']); 
      }, 1000);

    } else {
      this.showMessage('Email ou Senha incorretos. Tente novamente ou crie uma conta.', 'error');
    }
  }
}