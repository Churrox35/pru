import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../usuario-api/pokemon.service';
import { Pokemon } from '../models/pokemon.model';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [CommonModule,NgIf,RouterModule,FormsModule,MatIconModule],
  template: `
  <div class="search-bar">
  <input 
    type="text" 
    placeholder="Ingresa el nombre del Pokemon..." 
    [(ngModel)]="searchTerm" 
    (input)="filterPokemons()" 
  />
</div>

 <div class="table-container">
  <div class="card">
    <div class="card-header">
      <h2 class="card-title">TABLA DE POKÉMON</h2>
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
                <th>ID</th>
                <th>NOMBRE</th>
                <th>IMAGEN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let pokemon of displayedPokemons; let i = index; trackBy: trackByPokemonId">
                <td>{{ pokemon.id }}</td>
                <td>{{ pokemon.name }}</td>
                <td>
                  <img [src]="pokemon.image" [alt]="pokemon.name" class="pokemon-avatar" />
                </td>
                <td class="actions">
  <button mat-icon-button color="warn" (click)="deletePokemon(i)" class="action-button delete">
    <mat-icon>delete</mat-icon>
  </button>
  <button mat-icon-button color="accent" (click)="editPokemon(pokemon)" class="action-button edit">
    <mat-icon>edit</mat-icon>
  </button>
  <button mat-icon-button color="primary" (click)="viewPokemon(pokemon)" class="action-button view">
    <mat-icon>visibility</mat-icon>
  </button>
</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <span>MOSTRANDO {{ startIndex + 1 }} AL {{ endIndex }} DE {{ pokemons.length }} ENTRADAS</span>
          <div class="pagination-buttons">
            <button (click)="previousPage()" [disabled]="currentPage === 1" class="btn">ANTERIOR</button>
            <button (click)="nextPage()" [disabled]="endIndex >= pokemons.length" class="btn">SIGUIENTE</button>
          </div>
        </div>
      </ng-template>
    </div>
  </div>
</div>
<div *ngIf="editingPokemon" class="modal-backdrop">
  <div class="modal">
    <h3>Editar Pokémon</h3>
    <label>
      Nombre:
      <input [(ngModel)]="editingPokemon.name" />
    </label>
    <label>
      Imagen URL:
      <input [(ngModel)]="editingPokemon.image" />
    </label>
    
    <button (click)="closeEditModal()">Guardar</button>
  </div>
</div>

<!-- Modal para Visualizar -->
<div *ngIf="viewingPokemon" class="modal-backdrop">
  <div class="modal">
    <h3>Detalles de {{ viewingPokemon.name }}</h3>
    <p>ID: {{ viewingPokemon.id }}</p>
    <p>Peso: {{ viewingPokemon.details.weight }} kg</p>
    <p>Tipo: {{ viewingPokemon.details.types.join(', ') }}</p>
    <img [src]="viewingPokemon.image" [alt]="viewingPokemon.name" />
    <button (click)="closeViewModal()">Cerrar</button>
  </div>
</div>

  `,
  styles: [
    `
    /* Estilos básicos para la tabla */
.custom-table th, .custom-table td {
  padding: 10px;
  text-align: center;
}

.pokemon-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.action-button {
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.action-button.delete {
  color: #f44336;
}

.action-button.edit {
  color: #ff9800;
}

.action-button.view {
  color: #4caf50;
}
/* Modal de edición y visualización */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* Fondo más oscuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Siempre visible */
}

.modal {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 350px;
  text-align: center;
  animation: fadeIn 0.3s ease-out;
  color: #000; /* Asegura que todo el texto dentro de la modal sea negro */
}

.modal h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #000; /* Asegura que los encabezados sean negros */
}

.modal p {
  font-size: 1rem;
  color: #000; /* Asegura que los párrafos sean negros */
}

.modal input {
  color: #000; /* Texto negro en los campos de entrada */
}

.modal button {
  padding: 10px;
  border: none;
  background: linear-gradient(to right, #4e54c8, #8f94fb);
  color: white;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.modal button:hover {
  background: #6c70a6;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Centrar los botones */
.action-button {
  margin: 0 5px;
}

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

      .pokemon-avatar {
        border-radius: 30%;
        width: 60px;
        height: 60px;
        object-fit: cover;
        border: 1px solid #fff;
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
      .search-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-bar input {
  padding: 10px;
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
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
export class PokemonComponent implements OnInit {
  pokemons: Pokemon[] = [];
  displayedPokemons: Pokemon[] = [];
  searchTerm: string = ''; // Almacena el término de búsqueda
  loading = true;
  currentPage = 1;
  pageSize = 6;

  editingPokemon: Pokemon | null = null;
  viewingPokemon: any | null = null;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.loading = true;
    this.pokemonService.getPokemons().subscribe({
      next: (data) => {
        this.pokemons = data;
        this.updateDisplayedPokemons();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching pokemons:', error);
        this.loading = false;
      }
    });
  }

  updateDisplayedPokemons() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedPokemons = this.pokemons.slice(start, end);
  }

  filterPokemons() {
    const filtered = this.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      pokemon.id.toString().includes(this.searchTerm)
    );
    this.displayedPokemons = filtered.slice(0, this.pageSize);
  }

  nextPage() {
    if (this.endIndex < this.pokemons.length) {
      this.currentPage++;
      this.updateDisplayedPokemons();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPokemons();
    }
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.pokemons.length);
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

  deletePokemon(index: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará al Pokémon.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.displayedPokemons.splice(index, 1);
        Swal.fire('Eliminado', 'El Pokémon ha sido eliminado.', 'success');
      }
    });
  }

  editPokemon(pokemon: Pokemon) {
    this.editingPokemon = { ...pokemon };
  }

  closeEditModal() {
    const index = this.pokemons.findIndex(p => p.id === this.editingPokemon!.id);
    if (index !== -1) {
      this.pokemons[index] = this.editingPokemon!;
      this.updateDisplayedPokemons();
    }
    this.editingPokemon = null;
  }

  viewPokemon(pokemon: Pokemon) {
    this.pokemonService.getPokemonDetails(pokemon.id).subscribe({
      next: (details) => {
        this.viewingPokemon = {
          ...pokemon,
          details: {
            ...details,
            types: details.types.map((typeInfo: any) => typeInfo.type.name)
          }
        };
      },
      error: (error) => console.error('Error fetching pokemon details:', error)
    });
  }


  closeViewModal() {
    this.viewingPokemon = null;
  }
}