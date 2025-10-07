import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

// Interface para estruturar os dados do veículo
interface Vehicle {
  name: string;
  price: string;
  engine: string;
  power: string;
  fuel: string;
  consumption: string;
  steering: string;
  traction: string;
  imgSrc: string;
  link: string;
}

@Component({
  selector: 'app-catalogo', // NOVO SELETOR
  // imports: [], // Mantido como array vazio conforme sua requisição (pressupondo que está em um standalone ou importado em um módulo)
  templateUrl: './catalogo.component.html', // NOVO TEMPLATE URL
  styleUrl: './catalogo.component.css' // NOVO STYLE URL
})
export class CatalogoComponent implements OnInit { // NOVO NOME DA CLASSE
  // Estado da sidebar (aberta/fechada)
  isSidebarActive: boolean = true;
  
  // Variável para armazenar a largura da janela, útil para a lógica de responsividade
  windowWidth: number = window.innerWidth;

  // Dados do Catálogo de Veículos Ford
  vehicles: Vehicle[] = [
    {
      name: 'Ford Ka',
      price: 'R$ 50.000',
      engine: '1.0L Flex',
      power: '85 cv',
      fuel: 'Flex',
      consumption: '13 km/L (gasolina)',
      steering: 'Elétrica',
      traction: 'Dianteira',
      imgSrc: 'https://s2-autoesporte.glbimg.com/WFrBOaf8_FQBeSDWnbPMg7HzPAA=/0x0:620x413/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2020/a/R/aakUmYQfAKkDd0pOHhaQ/2018-07-24-ford-ka-sedan-autoesporte-12.jpg',
      link: 'https://www.ford.com.br/servico-ao-cliente/recall/2019/ford-ka-versoes-hatch-e-sedan-modelos-2018-e-2019/'
    },
    {
      name: 'Ford Fiesta 1.6',
      price: 'R$ 40.000',
      engine: '1.6L Flex',
      power: '125 cv (Álcool)',
      fuel: 'Flex (Gasolina e Álcool)',
      consumption: '14.0 km/L (gasolina)',
      steering: 'Assistida',
      traction: 'AdvanceTrac',
      imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Ford_Fiesta_ST-Line_%28VII%2C_Facelift%29_%E2%80%93_f_30012023.jpg/1200px-Ford_Fiesta_ST-Line_%28VII%2C_Facelift%29_%E2%80%93_f_30012023.jpg',
      link: 'https://media.ford.com/content/dam/fordmedia/South%20America/Brazil/2013/PRODUCTS/2013_Specs/Ficha%20T%C3%A9cnica_NewFiesta2014.pdf'
    },
    {
      name: 'Ford Focus 1.6',
      price: 'R$ 65.000',
      engine: '2.0L Flex',
      power: '109 cv (gasolina)',
      fuel: 'Flex (Gasolina e Álcool)',
      consumption: '9.5 km/L (gasolina)',
      steering: 'eletro-hidráulica',
      traction: 'Dianteira',
      imgSrc: 'https://www.autoo.com.br/fotos/2024/4/1280_960/focusabre1_11042024_78198_1280_960.jpg',
      link: 'https://pt.wikipedia.org/wiki/Ford_Focus'
    },
    {
      name: 'Ford EcoSport 2.0',
      price: 'R$ 65.000',
      engine: '1.5L Flex',
      power: '147 cv',
      fuel: 'Flex (Etanol e gasolina)',
      consumption: '12.1 km/L (gasolina)',
      steering: 'Hidráulica',
      traction: 'Dianteira (4x2)',
      imgSrc: 'https://cdn.motor1.com/images/mgl/KKMG0/s1/ford-ecosport-storm-4wd.webp',
      link: 'https://pt.wikipedia.org/wiki/Ford_EcoSport'
    },
    {
      name: 'Ford F-250',
      price: 'R$ 170.000',
      engine: '3.9 Turbo Diesel',
      power: '145 cv',
      fuel: 'Diesel',
      consumption: '7.2 km/L',
      steering: 'Hidráulica',
      traction: '4x2 (traseira) ou 4x4 (integral)',
      imgSrc: 'https://cdn.motor1.com/images/mgl/qkokOJ/s1/4x3/2023-ford-f-series-super-duty.webp',
      link: 'https://pt.wikipedia.org/wiki/Ford_F-250'
    },
    {
      name: 'Ford F-150',
      price: 'R$ 400.000',
      engine: 'Coyote 5.0 V8 32V',
      power: '405 cv a 6.000 rpm',
      fuel: 'Gasolina',
      consumption: '7.5 km/L',
      steering: 'Elétrica',
      traction: '4x4 (integral)',
      imgSrc: 'https://d2v1gjawtegg5z.cloudfront.net/posts/preview_images/000/015/499/original/2024_Ford_F-150.jpg?1725030127',
      link: 'https://www.ford.com.br/picapes/f-150/'
    },
    {
      name: 'Ford Fusion',
      price: 'R$ 84.000',
      engine: '2.0L EcoBoost',
      power: '253 cv',
      fuel: 'Gasolina',
      consumption: '10.5 km/L',
      steering: 'Elétrica',
      traction: 'Integral (AWD)',
      imgSrc: 'https://s2-autoesporte.glbimg.com/IjP0hjDlwXjlHZGwYTY1f1OHNio=/0x0:620x400/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2020/0/u/eNJBcEQaKMiEzJYcHGzg/2018-04-26-fordfusion-2.jpg',
      link: 'https://pt.wikipedia.org/wiki/Ford_Fusion'
    },
    {
      name: 'Ford Territory',
      price: 'R$ 170.000',
      engine: '1.5L EcoBoost GTDI',
      power: '169 cv',
      fuel: 'Gasolina',
      consumption: '10.3 km/L',
      steering: 'Eletroassistida',
      traction: 'Dianteira (AWD)',
      imgSrc: 'https://cdn.bandnewsfmcuritiba.com/band/wp-content/uploads/2023/09/NOVA-FORD-TERRITORY.jpg',
      link: 'https://www.ford.com.br/suvs-e-crossovers/territory/'
    },
    {
      name: 'Ford Bronco Sport',
      price: 'R$ 250.000',
      engine: '2.0L EcoBoost',
      power: '169 cv',
      fuel: 'Gasolina',
      consumption: '10.3 km/L',
      steering: 'Eletroassistida',
      traction: 'Integral Inteligente',
      imgSrc: 'https://www.ford.com.br/content/ford/br/pt_br/home/suvs-e-crossovers/bronco-sport/_jcr_content/par/cardcarousel/items/card_copy/imageComponent/image.imgs.full.high.jpg',
      link: 'https://www.ford.com.br/suvs-e-crossovers/bronco-sport/?utm_source=google_na&utm_medium=search&utm_content=search_generico_111274_intention&utm_campaign=sustain&bannerid=111274|google|na|search|generico|sustain|intention&gclsrc=aw.ds&gad_source=1&gad_campaignid=21337868081&gbraid=0AAAAADxk-g3UX2dLcBsnjMoRPqccc0GtK&gclid=EAIaIQobChMIpsmChdeIkAMVMmhIAB1uAixrEAAYASAAEgLMt_D_BwE'
    }
  ];

  constructor(private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Define o estado inicial da sidebar com base na largura da tela
    this.updateSidebarState(this.windowWidth);
  }

  // Captura o evento de redimensionamento da janela
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.windowWidth = (event.target as Window).innerWidth;
    this.updateSidebarState(this.windowWidth);
  }

  // Lógica para alternar a sidebar (usada no botão de mobile)
  toggleSidebar(): void {
    if (this.windowWidth < 768) {
      // Comportamento em Mobile: alterna o estado
      this.isSidebarActive = !this.isSidebarActive;
    }
  }

  // Lógica responsiva para a sidebar
  updateSidebarState(width: number): void {
    const isDesktop = width >= 768; // md breakpoint
    
    if (isDesktop) {
      // Em desktop, garante que a sidebar está aberta
      this.isSidebarActive = true;
    } else {
      // Em mobile, se estava aberta, mantém. Se estava fechada, mantém.
      // O toggle lida com a abertura/fechamento em mobile.
      // Apenas a inicialização deve fechar em mobile.
      if (width < 768 && !this.isSidebarActive) {
         this.isSidebarActive = false;
      }
    }
  }

  // Lógica do Logout
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redireciona para a página de login usando Angular Router
    
    // Em uma aplicação Angular real, usaríamos o Router
    // Ex: this.router.navigate(['/login']);
  }
}