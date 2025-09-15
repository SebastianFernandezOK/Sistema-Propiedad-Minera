import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TipoAlertaService } from '../services/tipo-alerta.service';
import { TipoAlerta } from '../models/tipo-alerta.model';

@Component({
  selector: 'app-tipo-alerta-detail',
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
            <mat-icon>warning</mat-icon>
            Detalle del Tipo de Alerta
          </mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="editarTipoAlerta()">
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

          <div *ngIf="!loading && tipoAlerta" class="detail-content">
            <div class="detail-field">
              <strong>ID:</strong> {{ tipoAlerta.IdTipoAlerta }}
            </div>
            <div class="detail-field">
              <strong>Descripción:</strong> {{ tipoAlerta.Descripcion }}
            </div>
            <div class="detail-field">
              <strong>ID Área:</strong> {{ tipoAlerta.IdArea || 'N/A' }}
            </div>
            <div class="detail-field">
              <strong>Asunto:</strong> {{ tipoAlerta.Asunto || 'N/A' }}
            </div>
            <div class="detail-field" *ngIf="tipoAlerta.Mensaje">
              <strong>Mensaje:</strong> {{ tipoAlerta.Mensaje }}
            </div>
            <div class="detail-field" *ngIf="tipoAlerta.Obs">
              <strong>Observaciones:</strong> {{ tipoAlerta.Obs }}
            </div>
            <div class="detail-field" *ngIf="tipoAlerta.AudFecha">
              <strong>Fecha de Auditoría:</strong> {{ tipoAlerta.AudFecha | date:'dd/MM/yyyy HH:mm:ss' }}
            </div>
            <div class="detail-field" *ngIf="tipoAlerta.AudUsuario">
              <strong>Usuario de Auditoría:</strong> {{ tipoAlerta.AudUsuario }}
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
export class TipoAlertaDetailComponent implements OnInit {
  loading = false;
  error: string | null = null;
  tipoAlerta: TipoAlerta | null = null;
  tipoAlertaId: number;

  constructor(
    private tipoAlertaService: TipoAlertaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tipoAlertaId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.cargarTipoAlerta();
  }

  private cargarTipoAlerta(): void {
    if (!this.tipoAlertaId || isNaN(this.tipoAlertaId)) {
      this.error = 'ID de tipo de alerta inválido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.tipoAlertaService.getById(this.tipoAlertaId).subscribe({
      next: (tipoAlerta) => {
        this.tipoAlerta = tipoAlerta;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tipo de alerta:', err);
        this.error = 'Error al cargar los datos del tipo de alerta.';
        this.loading = false;
      }
    });
  }

  editarTipoAlerta(): void {
    this.router.navigate(['/tipos-alerta', this.tipoAlertaId, 'editar']);
  }

  volver(): void {
    this.router.navigate(['/tipos-alerta']);
  }
}