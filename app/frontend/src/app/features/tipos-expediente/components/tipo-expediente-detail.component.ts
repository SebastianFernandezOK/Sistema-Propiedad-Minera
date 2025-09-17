import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TipoExpedienteService } from '../services/tipo-expediente.service';
import { TipoExpediente } from '../models/tipo-expediente.model';

@Component({
  selector: 'app-tipo-expediente-detail',
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
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>folder</mat-icon>
            Detalle del Tipo de Expediente
          </mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="editarTipoExpediente()">
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

          <div *ngIf="!loading && tipoExpediente" class="detail-content">
            <div class="detail-field">
              <strong>ID:</strong> {{ tipoExpediente.IdTipoExpediente }}
            </div>
            
            <div class="detail-field">
              <strong>Nombre:</strong> {{ tipoExpediente.Nombre }}
            </div>
            
            <div class="detail-field">
              <strong>Descripción:</strong> 
              <div class="descripcion-content">
                {{ tipoExpediente.Descripcion }}
              </div>
            </div>
            
            <div class="detail-field">
              <strong>Estado:</strong>
              <mat-chip [class]="tipoExpediente.Activo ? 'activo-chip' : 'inactivo-chip'">
                <mat-icon>{{ tipoExpediente.Activo ? 'check_circle' : 'cancel' }}</mat-icon>
                {{ tipoExpediente.Activo ? 'Activo' : 'Inactivo' }}
              </mat-chip>
            </div>
            
            <div class="detail-field" *ngIf="tipoExpediente.AudFecha">
              <strong>Fecha de Auditoría:</strong> {{ tipoExpediente.AudFecha | date:'dd/MM/yyyy HH:mm:ss' }}
            </div>
            
            <div class="detail-field" *ngIf="tipoExpediente.AudUsuario">
              <strong>Usuario de Auditoría:</strong> {{ tipoExpediente.AudUsuario }}
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
      max-width: 700px;
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
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .detail-field {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #416759;
    }

    .detail-field strong {
      color: #333;
      margin-bottom: 0.5rem;
      display: block;
    }

    .descripcion-content {
      margin-top: 0.5rem;
      line-height: 1.6;
      color: #555;
      white-space: pre-wrap;
    }

    .activo-chip {
      background-color: #e8f5e8;
      color: #2e7d32;
      margin-top: 0.5rem;
    }

    .inactivo-chip {
      background-color: #ffebee;
      color: #c62828;
      margin-top: 0.5rem;
    }

    .activo-chip mat-icon,
    .inactivo-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
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

    .mat-mdc-chip {
      font-size: 0.875rem;
      min-height: 28px;
      display: inline-flex;
      align-items: center;
    }
  `]
})
export class TipoExpedienteDetailComponent implements OnInit {
  loading = false;
  error: string | null = null;
  tipoExpediente: TipoExpediente | null = null;
  tipoExpedienteId: number;

  constructor(
    private tipoExpedienteService: TipoExpedienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tipoExpedienteId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.cargarTipoExpediente();
  }

  private cargarTipoExpediente(): void {
    if (!this.tipoExpedienteId || isNaN(this.tipoExpedienteId)) {
      this.error = 'ID de tipo de expediente inválido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.tipoExpedienteService.getById(this.tipoExpedienteId).subscribe({
      next: (tipoExpediente) => {
        this.tipoExpediente = tipoExpediente;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tipo de expediente:', err);
        this.error = 'Error al cargar los datos del tipo de expediente.';
        this.loading = false;
      }
    });
  }

  editarTipoExpediente(): void {
    this.router.navigate(['/tipos-expediente', this.tipoExpedienteId, 'editar']);
  }

  volver(): void {
    this.router.navigate(['/tipos-expediente']);
  }
}