import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-usuario-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="detail-container">
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Cargando usuario...</p>
      </div>

      <div *ngIf="error" class="error-container">
        <mat-icon>error</mat-icon>
        <h3>Error al cargar el usuario</h3>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="loadUsuario()">
          <mat-icon>refresh</mat-icon>
          Reintentar
        </button>
      </div>

      <mat-card *ngIf="usuario && !loading && !error">
        <div class="detail-header">
          <mat-card-title>{{ usuario.NombreCompleto }}</mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="accent" (click)="cambiarPassword()">
              <mat-icon>lock</mat-icon>
              Cambiar Contraseña
            </button>
            <button mat-raised-button color="primary" (click)="editUsuario()">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-raised-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Volver
            </button>
          </div>
        </div>

        <mat-card-content>
          <div class="detail-grid">
            <div class="detail-section">
              <h3>Información Personal</h3>
              <div class="detail-row">
                <span class="label">ID:</span>
                <span class="value">{{ usuario.IdUsuario }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Nombre Completo:</span>
                <span class="value">{{ usuario.NombreCompleto }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Nombre de Usuario:</span>
                <span class="value">{{ usuario.NombreUsuario }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">{{ usuario.Email }}</span>
              </div>
              <div class="detail-row" *ngIf="usuario.Telefono">
                <span class="label">Teléfono:</span>
                <span class="value">{{ usuario.Telefono }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h3>Información del Sistema</h3>
              <div class="detail-row">
                <span class="label">Rol:</span>
                <mat-chip-set>
                  <mat-chip [style.background-color]="getRolColor(usuario.Rol)">
                    {{ usuario.Rol }}
                  </mat-chip>
                </mat-chip-set>
              </div>
              <div class="detail-row">
                <span class="label">Estado:</span>
                <mat-chip-set>
                  <mat-chip [style.background-color]="usuario.Activo ? '#4caf50' : '#f44336'" 
                           [style.color]="'white'">
                    {{ usuario.Activo ? 'Activo' : 'Inactivo' }}
                  </mat-chip>
                </mat-chip-set>
              </div>
              <div class="detail-row">
                <span class="label">Fecha de Creación:</span>
                <span class="value">{{ formatDate(usuario.FechaCreacion) }}</span>
              </div>
              <div class="detail-row" *ngIf="usuario.UltimaConexion">
                <span class="label">Última Conexión:</span>
                <span class="value">{{ formatDateTime(usuario.UltimaConexion) }}</span>
              </div>
            </div>

            <div class="detail-section full-width" *ngIf="usuario.Observacion || usuario.Descripcion">
              <h3>Información Adicional</h3>
              <div class="detail-row" *ngIf="usuario.Observacion">
                <span class="label">Observación:</span>
                <span class="value">{{ usuario.Observacion }}</span>
              </div>
              <div class="detail-row" *ngIf="usuario.Descripcion">
                <span class="label">Descripción:</span>
                <span class="value">{{ usuario.Descripcion }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1000px;
      margin: 20px auto;
      padding: 0 20px;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
    }

    .error-container mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #f44336;
      margin-bottom: 16px;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .detail-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .detail-section.full-width {
      grid-column: 1 / -1;
    }

    .detail-section h3 {
      margin: 0 0 16px 0;
      color: #1f2937;
      font-weight: 600;
      font-size: 16px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }

    .detail-row {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
    }

    .detail-row .label {
      font-weight: 500;
      color: #6b7280;
      min-width: 140px;
      margin-right: 12px;
    }

    .detail-row .value {
      color: #1f2937;
      flex: 1;
    }

    mat-chip-set {
      display: flex;
    }

    mat-chip {
      color: white;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .detail-container {
        margin: 10px;
        padding: 0 10px;
      }

      .detail-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header-actions {
        justify-content: center;
      }

      .detail-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .detail-row .label {
        min-width: auto;
        margin-right: 0;
        margin-bottom: 4px;
      }
    }
  `]
})
export class UsuarioDetailComponent implements OnInit {
  usuario: Usuario | null = null;
  loading = false;
  error: string | null = null;
  private usuarioId: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.usuarioId = +params['id'];
      this.loadUsuario();
    });
  }

  loadUsuario(): void {
    this.loading = true;
    this.error = null;

    this.usuarioService.getById(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.error = 'Error al cargar el usuario. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  editUsuario(): void {
    this.router.navigate(['/usuarios', this.usuarioId, 'editar']);
  }

  cambiarPassword(): void {
    this.router.navigate(['/usuarios', this.usuarioId, 'cambiar-password']);
  }

  goBack(): void {
    this.router.navigate(['/usuarios']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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