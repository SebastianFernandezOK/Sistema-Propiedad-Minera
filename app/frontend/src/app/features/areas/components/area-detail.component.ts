import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AreaService } from '../services/area.service';
import { Area } from '../models/area.model';

@Component({
  selector: 'app-area-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="area-detail-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>business</mat-icon>
            Detalle del Área
          </mat-card-title>
          <div class="header-actions">
            <button mat-button (click)="volver()">
              <mat-icon>arrow_back</mat-icon>
              Volver
            </button>
            <button mat-raised-button color="primary" (click)="editarArea()" *ngIf="area">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <!-- Loading Spinner -->
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando información del área...</p>
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="error-message">
            <mat-icon>error</mat-icon>
            {{ error }}
            <button mat-button (click)="cargarArea()">Reintentar</button>
          </div>

          <!-- Area Details -->
          <div *ngIf="!loading && !error && area" class="area-details">
            <div class="detail-section">
              <h3>Información General</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>ID:</label>
                  <span>{{ area.IdArea }}</span>
                </div>
                <div class="detail-item">
                  <label>Descripción:</label>
                  <span>{{ area.Descripcion }}</span>
                </div>
                <div class="detail-item" *ngIf="area.AudFecha">
                  <label>Última modificación:</label>
                  <span>{{ area.AudFecha | date:'dd/MM/yyyy HH:mm:ss' }}</span>
                </div>
                <div class="detail-item" *ngIf="area.AudUsuario !== null">
                  <label>Usuario:</label>
                  <span>{{ area.AudUsuario }}</span>
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .area-detail-container {
      padding: 1.5rem;
      max-width: 800px;
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

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
      background: #ffebee;
      padding: 1rem;
      border-radius: 4px;
      border-left: 4px solid #f44336;
    }

    .area-details {
      margin-top: 1rem;
    }

    .detail-section {
      margin-bottom: 2rem;
    }

    .detail-section h3 {
      color: #416759;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 0.5rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-item label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }

    .detail-item span {
      padding: 0.5rem;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
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
export class AreaDetailComponent implements OnInit {
  area: Area | null = null;
  loading = false;
  error: string | null = null;
  areaId: number;

  constructor(
    private areaService: AreaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.areaId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.cargarArea();
  }

  cargarArea(): void {
    if (!this.areaId || isNaN(this.areaId)) {
      this.error = 'ID de área inválido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.areaService.getById(this.areaId).subscribe({
      next: (area) => {
        this.area = area;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar área:', err);
        this.error = 'Error al cargar la información del área';
        this.loading = false;
      }
    });
  }

  editarArea(): void {
    if (this.area) {
      this.router.navigate(['/areas', this.area.IdArea, 'editar']);
    }
  }

  volver(): void {
    this.router.navigate(['/areas']);
  }
}