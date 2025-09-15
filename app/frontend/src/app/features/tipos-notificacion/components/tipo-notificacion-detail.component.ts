import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TipoNotificacionService } from '../services/tipo-notificacion.service';
import { TipoNotificacion } from '../models/tipo-notificacion.model';

@Component({
  selector: 'app-tipo-notificacion-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="detail-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>notifications</mat-icon>
            Detalle del Tipo de Notificación
          </mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="editarTipoNotificacion()">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-button (click)="volver()">
              <mat-icon>arrow_back</mat-icon>
              Volver
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando...</p>
          </div>

          <div *ngIf="!loading && tipoNotificacion" class="detail-content">
            <div class="detail-field">
              <strong>ID:</strong> {{ tipoNotificacion.IdTipoNotificacion }}
            </div>
            <div class="detail-field">
              <strong>Descripción:</strong> {{ tipoNotificacion.Descripcion }}
            </div>
            <div class="detail-field">
              <strong>Descripción Corta:</strong> {{ tipoNotificacion.DescCorta || 'N/A' }}
            </div>
            <div class="detail-field" *ngIf="tipoNotificacion.AudFecha">
              <strong>Fecha de Auditoría:</strong> {{ tipoNotificacion.AudFecha | date:'dd/MM/yyyy HH:mm:ss' }}
            </div>
            <div class="detail-field" *ngIf="tipoNotificacion.AudUsuario">
              <strong>Usuario de Auditoría:</strong> {{ tipoNotificacion.AudUsuario }}
            </div>
          </div>

          <div *ngIf="error" class="error-message">
            <mat-icon>error</mat-icon>
            {{ error }}
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      gap: 1rem;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .detail-field {
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #416759;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
      background: #ffebee;
      padding: 1rem;
      border-radius: 4px;
      border-left: 4px solid #f44336;
      margin-top: 1rem;
    }

    mat-card {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    mat-card-header {
      background: #f8f9fa;
      padding: 1.5rem;
      margin: -1rem -1rem 0 -1rem;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #416759;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    mat-card-content {
      padding: 1.5rem;
    }

    button[color="primary"] {
      background: #416759;
      color: white;
    }

    button[color="primary"]:hover {
      background: #355a4c;
    }
  `]
})
export class TipoNotificacionDetailComponent implements OnInit {
  loading = false;
  error: string | null = null;
  tipoNotificacion: TipoNotificacion | null = null;
  tipoNotificacionId: number;

  constructor(
    private tipoNotificacionService: TipoNotificacionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tipoNotificacionId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.cargarTipoNotificacion();
  }

  private cargarTipoNotificacion(): void {
    if (!this.tipoNotificacionId || isNaN(this.tipoNotificacionId)) {
      this.error = 'ID de tipo de notificación inválido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.tipoNotificacionService.getById(this.tipoNotificacionId).subscribe({
      next: (tipoNotificacion) => {
        this.tipoNotificacion = tipoNotificacion;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tipo de notificación:', err);
        this.error = 'Error al cargar los datos del tipo de notificación.';
        this.loading = false;
      }
    });
  }

  editarTipoNotificacion(): void {
    this.router.navigate(['/tipos-notificacion', this.tipoNotificacionId, 'editar']);
  }

  volver(): void {
    this.router.navigate(['/tipos-notificacion']);
  }
}