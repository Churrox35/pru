import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../usuario-api/usuario-api';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">TABLA DE USUARIOS</h2>
        </div>
        <div class="card-content">
          <ng-container *ngIf="loading; else loadedContent">
            <div class="skeleton-container">
              <div *ngFor="let item of [1,2,3,4,5,6]" class="skeleton"></div>
            </div>
          </ng-container>
          <ng-template #loadedContent>
            <div class="table-wrapper">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>IDENTIFICADOR</th>
                    <th>NOMBRE</th>
                    <th>CORREO ELECTRÓNICO</th>
                    <th>ROL</th>
                    <th>IMAGEN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of displayedUsers; trackBy: trackByUserId">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role }}</td>
                    <td>
                      <img [src]="user.avatar" [alt]="user.name" class="user-avatar">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination">
              <span>MOSTRANDO {{ startIndex + 1 }} AL {{ endIndex }} DE {{ users.length }} ENTRADAS</span>
              <div class="pagination-buttons">
                <button (click)="previousPage()" [disabled]="currentPage === 1" class="btn">ANTERIOR</button>
                <button (click)="nextPage()" [disabled]="endIndex >= users.length" class="btn">SIGUIENTE</button>
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .table-container {
        padding: 20px;
        max-width: 95%;
        margin: auto;
      }

      .card {
        background: linear-gradient(to right, #4e54c8, #8f94fb);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
      }

      .card-header {
        text-align: center;
        margin-bottom: 20px;
      }

      .card-title {
        color: white;
        font-size: 2rem;
        font-weight: 600;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      .custom-table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        overflow: hidden;
      }

      .custom-table th, .custom-table td {
        padding: 12px 20px;
        text-align: center;
        font-size: 14px;
      }

      .custom-table th {
        background: #3c3f58;
        color: white;
        text-transform: uppercase;
        font-weight: 700;
      }

      .custom-table td {
        color: white;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      .custom-table tr:last-child td {
        border-bottom: none;
      }

      .user-avatar {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        object-fit: cover;
        border: 2px solid #fff;
      }

      .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        color: white;
        font-size: 14px;
      }

      .pagination-buttons {
        display: flex;
        gap: 10px;
      }

      .btn {
        padding: 8px 16px;
        border: none;
        background: #3c3f58;
        color: white;
        font-size: 14px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;
      }

      .btn:hover {
        background: #6c70a6;
      }

      .btn:disabled {
        background: rgba(255, 255, 255, 0.3);
        cursor: not-allowed;
      }

      .skeleton-container {
        display: grid;
        gap: 12px;
      }

      .skeleton {
        height: 20px;
        background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
      }

      @keyframes skeleton-loading {
        from {
          background-position: 200% 0;
        }
        to {
          background-position: -200% 0;
        }
      }
    `
  ]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedUsers: User[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 6; // Cambiado de 10 a 6

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.updateDisplayedUsers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    });
  }

  updateDisplayedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedUsers = this.users.slice(start, end);
  }

  nextPage() {
    if (this.endIndex < this.users.length) {
      this.currentPage++;
      this.updateDisplayedUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedUsers();
    }
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.users.length);
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
