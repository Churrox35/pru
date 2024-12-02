import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../usuario-api/usuario-api';
import { User } from '../models/user.model';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf,RouterModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        const user = users.find(
          u => u.email === this.email && u.password === this.password
        );
  
        if (user) {
          // Guardar usuario autenticado en localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/main-nav']);
        } else {
          this.error = 'Correo o contraseña incorrectos';
        }
      },
      (error) => {
        this.error = 'Error de conexión. Inténtelo de nuevo.';
        console.error(error);
      }
    );
  }
  
  
}