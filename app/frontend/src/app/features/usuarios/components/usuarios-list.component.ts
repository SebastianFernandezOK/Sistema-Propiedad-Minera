import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    FormsModule
  ],
  template: `
    <div class="usuarios-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>people</mat-icon>
            Gestión de Usuarios
          </mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="crearUsuario()">
              <mat-icon>add</mat-icon>
              Nuevo Usuario
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <!-- Loading Spinner -->
          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Cargando usuarios...</p>
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="error-container">
            <mat-icon>error</mat-icon>
            <h3>Error al cargar los usuarios</h3>
            <p>{{ error }}</p>
            <button mat-raised-button color="primary" (click)="loadUsuarios()">
              <mat-icon>refresh</mat-icon>
              Reintentar
            </button>
          </div>

          <!-- Data Table -->
          <div *ngIf="!loading && !error" class="table-container">
            <table mat-table [dataSource]="usuarios" class="usuarios-table">

              <!-- ID Column -->
              <ng-container matColumnDef="IdUsuario">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let usuario">{{ usuario.IdUsuario }}</td>
              </ng-container>

              <!-- Nombre Completo Column -->
              <ng-container matColumnDef="NombreCompleto">
                <th mat-header-cell *matHeaderCellDef>Nombre Completo</th>
                <td mat-cell *matCellDef="let usuario">{{ usuario.NombreCompleto }}</td>
              </ng-container>

              <!-- Nombre Usuario Column -->
              <ng-container matColumnDef="NombreUsuario">
                <th mat-header-cell *matHeaderCellDef>Usuario</th>
                <td mat-cell *matCellDef="let usuario">{{ usuario.NombreUsuario }}</td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="Email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let usuario">{{ usuario.Email }}</td>
              </ng-container>

              <!-- Rol Column -->
              <ng-container matColumnDef="Rol">
                <th mat-header-cell *matHeaderCellDef>Rol</th>
                <td mat-cell *matCellDef="let usuario">
                  <mat-chip-set>
                    <mat-chip [style.background-color]="getRolColor(usuario.Rol)">
                      {{ usuario.Rol }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Estado Column -->
              <ng-container matColumnDef="Activo">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let usuario">
                  <mat-chip-set>
                    <mat-chip [style.background-color]="usuario.Activo ? '#4caf50' : '#f44336'" 
                             [style.color]="'white'">
                      {{ usuario.Activo ? 'Activo' : 'Inactivo' }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Fecha Creación Column -->
              <ng-container matColumnDef="FechaCreacion">
                <th mat-header-cell *matHeaderCellDef>Fecha Creación</th>
                <td mat-cell *matCellDef="let usuario">{{ formatDate(usuario.FechaCreacion) }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let usuario">
                  <div class="actions-container">
                    <button mat-icon-button 
                            color="primary" 
                            (click)="verDetalle(usuario.IdUsuario)"
                            matTooltip="Ver detalle">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button 
                            color="accent" 
                            (click)="editarUsuario(usuario.IdUsuario)"
                            matTooltip="Editar usuario">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button 
                            [color]="usuario.Activo ? 'warn' : 'primary'"
                            (click)="toggleActivo(usuario)"
                            [matTooltip]="usuario.Activo ? 'Desactivar usuario' : 'Activar usuario'">
                      <mat-icon>{{ usuario.Activo ? 'block' : 'check_circle' }}</mat-icon>
                    </button>
                    <button mat-icon-button 
                            color="warn" 
                            (click)="eliminarUsuario(usuario.IdUsuario)"
                            matTooltip="Eliminar usuario">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- No Data Message -->
            <div *ngIf="usuarios.length === 0" class="no-data-container">
              <mat-icon>people_outline</mat-icon>
              <h3>No hay usuarios registrados</h3>
              <p>Comience creando su primer usuario</p>
              <button mat-raised-button color="primary" (click)="crearUsuario()">
                <mat-icon>add</mat-icon>
                Crear Usuario
              </button>
            </div>

            <!-- Paginator -->
            <mat-paginator 
              *ngIf="usuarios.length > 0"
              [length]="totalItems"
              [pageSize]="pageSize"
              [pageIndex]="currentPage"
              [pageSizeOptions]="[5, 10, 25, 50]"
              (page)="onPageChange($event)"
              showFirstLastButtons>
            </mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .usuarios-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .loading-container, .error-container, .no-data-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
    }

    .error-container mat-icon, .no-data-container mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    .error-container mat-icon {
      color: #f44336;
    }

    .no-data-container mat-icon {
      color: #9ca3af;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .usuarios-table {
      width: 100%;
      background: white;
    }

    .usuarios-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #374151;
    }

    .usuarios-table td, .usuarios-table th {
      padding: 12px 8px;
      border-bottom: 1px solid #e5e7eb;
    }

    .actions-container {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    mat-chip-set {
      display: flex;
    }

    mat-chip {
      color: white;
      font-weight: 500;
      font-size: 12px;
    }

    mat-paginator {
      border-top: 1px solid #e5e7eb;
      background-color: #f8f9fa;
    }

    @media (max-width: 768px) {
      .usuarios-container {
        padding: 10px;
      }

      mat-card-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header-actions {
        justify-content: center;
      }

      .usuarios-table {
        font-size: 14px;
      }

      .usuarios-table td, .usuarios-table th {
        padding: 8px 4px;
      }

      .actions-container {
        flex-direction: column;
        gap: 2px;
      }
    }

    @media (max-width: 480px) {
      .usuarios-table td, .usuarios-table th {
        padding: 6px 2px;
        font-size: 12px;
      }

      mat-chip {
        font-size: 10px;
        min-height: 24px;
      }
    }
  `]
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  displayedColumns: string[] = [
    'IdUsuario',
    'NombreCompleto', 
    'NombreUsuario',
    'Email',
    'Rol',
    'Activo',
    'FechaCreacion',
    'acciones'
  ];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.error = null;

    this.usuarioService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.usuarios = response.data;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'Error al cargar los usuarios. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsuarios();
  }

  crearUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/usuarios', id]);
  }

  editarUsuario(id: number): void {
    this.router.navigate(['/usuarios', id, 'editar']);
  }

  toggleActivo(usuario: Usuario): void {
    const nuevoEstado = !usuario.Activo;
    this.usuarioService.activarDesactivar(usuario.IdUsuario, { activo: nuevoEstado }).subscribe({
      next: () => {
        usuario.Activo = nuevoEstado;
        console.log(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`);
      },
      error: (err) => {
        console.error('Error al cambiar estado del usuario:', err);
        // Aquí podrías mostrar un snackbar o mensaje de error
      }
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.usuarioService.delete(id).subscribe({
        next: () => {
          console.log('Usuario eliminado exitosamente');
          this.loadUsuarios(); // Recargar la lista
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          // Aquí podrías mostrar un snackbar o mensaje de error
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  getRolColor(rol: string): string {
    const colors: { [key: string]: string } = {
      'Administrador': '#f44336',
      'Usuario': '#2196f3',
      'Consultor': '#ff9800',
      'Supervisor': '#9c27b0'
    };
    return colors[rol] || '#6b7280';
  }
}