import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from '../usuario-api/usuario-api';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-main-nav',
  standalone: true,
  templateUrl: './main-nav.component.html',
  styles: [`.sidenav-container {
    height: 100%;
    
  }
  
  .sidenav {
    width: 250px;
    background: linear-gradient(to bottom, #191654, #43C6AC);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  .sidenav .mat-toolbar {
    background: inherit;
    padding: 16px;
    font-weight: bold;
    
    color: #ffffff;
  }
  
  .mat-nav-list {
    padding: 0;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    color: #ffffff;
    padding: 12px 16px;
    font-size: 16px;
    border-radius: 8px;
    margin-bottom: 10px;
    transition: background 0.3s ease;
  }
  
  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .mat-icon {
    margin-right: 12px;
  }
  
  .logout-button {
    margin-top: auto;  /* Lo coloca al final */
    background-color: #43C6AC;
    color: #191654;
    font-weight: bold;
    padding: 12px 16px;
    text-align: center;
    border-radius: 8px;
    transition: background 0.3s ease;
  }
  
  .logout-button:hover {
    background-color: #191654;
    color: #43C6AC;
  }
  .user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%; /* Hace la imagen circular */
  object-fit: cover; /* Ajusta la imagen sin distorsión */
  cursor: pointer; /* Añade un puntero al pasar el mouse */
}
.user-menu {
  margin-left: auto; /* Empuja el menú de usuario al extremo derecho */
}
`],
  imports: [
    MatToolbarModule,
    MatButtonModule,MatMenuModule, 
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    MatSlideToggleModule,
    NgIf,
    RouterModule,
    FormsModule
  ]
})
export class MainNavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Información del usuario autenticado
  userImage: string = '';
  userName: string = '';

  constructor(private router: Router) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.userImage = user.avatar; // Ajusta según el campo real del avatar en la API
      this.userName = user.name || 'Usuario'; // Ajusta según el campo real del nombre
    }
  }

  logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Se cerrará tu sesión!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para cerrar sesión
        localStorage.removeItem('currentUser'); // Borra datos del usuario
        this.router.navigate(['/login']); // Redirige a login
      }
    });
  }}