import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExpedienteService } from './services/expediente.service';
import { Expediente } from './models/expediente.model';
import { ActasComponent } from '../actas/components/actas.component';
import { ResolucionesListComponent } from '../resoluciones/components/resoluciones-list.component';

@Component({
  selector: 'app-expedientes-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    ActasComponent,
    ResolucionesListComponent
  ],
  template: `
    <div class="expediente-detail-container">
      <!-- Loading spinner -->
      <div *ngIf="loading" class="loading-container">
        <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
        <p>Cargando expediente...</p>
      </div>

      <!-- Expediente detail -->
      <div *ngIf="expediente && !loading">
        <!-- Header with actions -->
        <div class="detail-header">
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Expediente {{ expediente.CodigoExpediente || '#' + expediente.IdExpediente }}</h1>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="editarExpediente()">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-raised-button color="warn" (click)="eliminarExpediente()">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </div>
        </div>

        <mat-tab-group>
          <!-- Información General -->
          <mat-tab label="Información General">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Datos Básicos</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>ID Expediente:</label>
                      <span>{{ expediente.IdExpediente }}</span>
                    </div>
                    
                    <div class="info-item">
                      <label>Código:</label>
                      <span>{{ expediente.CodigoExpediente || 'Sin código' }}</span>
                    </div>
                    
                    <div class="info-item">
                      <label>Primer Dueño:</label>
                      <span>{{ expediente.PrimerDueno || 'Sin especificar' }}</span>
                    </div>
                    
                    <div class="info-item">
                      <label>Estado:</label>
                      <mat-chip [ngClass]="'estado-' + (expediente.Estado || 'sin-estado').toLowerCase()">
                        {{ expediente.Estado || 'Sin estado' }}
                      </mat-chip>
                    </div>
                    
                    <div class="info-item">
                      <label>Dependencia:</label>
                      <span>{{ expediente.Dependencia || 'Sin dependencia' }}</span>
                    </div>
                    
                    <div class="info-item">
                      <label>Año:</label>
                      <span>{{ expediente.Ano ? (expediente.Ano | date:'yyyy') : 'Sin ano' }}</span>
                    </div>
                    
                    <div class="info-item">
                      <label>Fecha Inicio:</label>
                      <span>{{ expediente.FechaInicio ? (expediente.FechaInicio | date:'dd/MM/yyyy') : 'Sin fecha' }}</span>
                    </div>
                    
                    <div class="info-item">
                      <label>Fecha Fin:</label>
                      <span>{{ expediente.FechaFin ? (expediente.FechaFin | date:'dd/MM/yyyy') : 'Sin fecha' }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card *ngIf="expediente.Caratula || expediente.Descripcion || expediente.Observaciones">
                <mat-card-header>
                  <mat-card-title>Descripción y Observaciones</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="description-section">
                    <div *ngIf="expediente.Caratula" class="description-item">
                      <label>Carátula:</label>
                      <p>{{ expediente.Caratula }}</p>
                    </div>
                    
                    <mat-divider *ngIf="expediente.Caratula && expediente.Descripcion"></mat-divider>
                    
                    <div *ngIf="expediente.Descripcion" class="description-item">
                      <label>Descripción:</label>
                      <p>{{ expediente.Descripcion }}</p>
                    </div>
                    
                    <mat-divider *ngIf="(expediente.Caratula || expediente.Descripcion) && expediente.Observaciones"></mat-divider>
                    
                    <div *ngIf="expediente.Observaciones" class="description-item">
                      <label>Observaciones:</label>
                      <p>{{ expediente.Observaciones }}</p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Actas -->
          <mat-tab label="Actas">
            <div class="tab-content">
              <app-actas [idExpediente]="expediente.IdExpediente"></app-actas>
            </div>
          </mat-tab>

          <!-- Resoluciones -->
          <mat-tab label="Resoluciones">
            <div class="tab-content">
              <app-resoluciones-list [idExpediente]="expediente.IdExpediente"></app-resoluciones-list>
            </div>
          </mat-tab>

          <!-- Alertas -->
          <mat-tab label="Alertas" [disabled]="!expediente.alertas || expediente.alertas.length === 0">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>
                    Alertas Asociadas 
                    <mat-chip *ngIf="expediente.alertas?.length" class="count-chip">
                      {{ expediente.alertas?.length }}
                    </mat-chip>
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <mat-list *ngIf="expediente.alertas && expediente.alertas.length > 0">
                    <mat-list-item *ngFor="let alerta of expediente.alertas">
                      <div class="alerta-item">
                        <div class="alerta-info">
                          <span class="alerta-id">Alerta #{{ alerta.idAlerta }}</span>
                          <span class="alerta-transaccion">Transacción: {{ alerta.IdTransaccion }}</span>
                        </div>
                        <mat-chip [ngClass]="'estado-' + (alerta.Estado || 'sin-estado').toLowerCase()">
                          {{ alerta.Estado || 'Sin estado' }}
                        </mat-chip>
                      </div>
                    </mat-list-item>
                  </mat-list>
                  
                  <div *ngIf="!expediente.alertas || expediente.alertas.length === 0" class="no-data">
                    <mat-icon>info</mat-icon>
                    <p>No hay alertas asociadas a este expediente.</p>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>

      <!-- Error state -->
      <div *ngIf="error && !loading" class="error-container">
        <mat-card>
          <mat-card-content>
            <div class="error-content">
              <mat-icon color="warn">error</mat-icon>
              <h3>Error al cargar el expediente</h3>
              <p>{{ error }}</p>
              <button mat-raised-button color="primary" (click)="loadExpediente()">
                <mat-icon>refresh</mat-icon>
                Reintentar
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .expediente-detail-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .detail-header h1 {
      flex: 1;
      margin: 0;
      font-size: 28px;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .back-button {
      color: #666;
    }

    .tab-content {
      padding: 24px 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item label {
      font-weight: 500;
      color: #666;
      font-size: 14px;
    }

    .info-item span {
      font-size: 16px;
      color: #333;
    }

    .description-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .description-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .description-item label {
      font-weight: 500;
      color: #666;
      font-size: 14px;
    }

    .description-item p {
      margin: 0;
      line-height: 1.5;
      color: #333;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      text-align: center;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 32px;
      color: #666;
    }

    .alerta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 8px 0;
    }

    .alerta-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .alerta-id {
      font-weight: 500;
    }

    .alerta-transaccion {
      font-size: 14px;
      color: #666;
    }

    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 20px;
      text-align: center;
      color: #d32f2f;
    }

    .error-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .error-content mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    /* Estado chips */
    mat-chip {
      font-size: 12px;
      font-weight: 500;
    }

    .estado-activo {
      background-color: #e8f4f1 !important;
      color: #416759 !important;
    }

    .estado-cerrado {
      background-color: #f4f4f4 !important;
      color: #666666 !important;
    }

    .estado-suspendido {
      background-color: #f9f9f9 !important;
      color: #7a7a7a !important;
    }

    .estado-sin-estado {
      background-color: #ffffff !important;
      color: #999999 !important;
      border: 1px solid #e0e0e0 !important;
    }

    /* Botones personalizados con colores corporativos */
    .mat-raised-button.mat-primary {
      background-color: #416759 !important;
      color: white !important;
    }

    .mat-raised-button.mat-primary:hover {
      background-color: #335248 !important;
    }

    .mat-icon-button.mat-primary {
      color: #416759 !important;
    }

    .mat-icon-button.mat-accent {
      color: #416759 !important;
    }

    .mat-button.mat-primary {
      color: #416759 !important;
    }

    /* Elementos de fondo con toque verde corporativo */
    .mat-card {
      border-top: 3px solid #416759;
    }

    .mat-card-header {
      background-color: #fafbfa;
      border-bottom: 1px solid #e8f0ec;
    }

    .tab-content {
      background-color: #fcfcfc;
    }

    .loading-container {
      background-color: #f9fafa;
    }

    .no-data {
      background-color: #f9fafa;
      border: 1px dashed #c4d3c8;
      border-radius: 8px;
    }

    .error-message {
      background-color: #fef9f9;
      border: 1px solid #f5c6c6;
      border-radius: 8px;
    }

    /* Progress spinner con color corporativo */
    .mat-progress-spinner circle {
      stroke: #416759 !important;
    }

    .mat-spinner circle {
      stroke: #416759 !important;
    }

    @media (max-width: 768px) {
      .detail-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .header-actions {
        width: 100%;
        justify-content: stretch;
      }

      .header-actions button {
        flex: 1;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .table-container {
        overflow-x: auto;
      }
    }

    @media (max-width: 480px) {
      .actas-table {
        min-width: 700px;
      }
      
      .resoluciones-table {
        min-width: 700px;
      }
      
      .actas-table th,
      .actas-table td {
        padding: 6px 4px;
        font-size: 11px;
      }
      
      .resoluciones-table th,
      .resoluciones-table td {
        padding: 6px 4px;
        font-size: 11px;
      }
      
      .descripcion-cell {
        max-width: 100px;
      }
      
      .action-buttons button {
        width: 32px;
        height: 32px;
      }
    }
  `]
})
export class ExpedientesDetailComponent implements OnInit {
  expediente: Expediente | null = null;
  loading = false;
  error: string | null = null;
  expedienteId: number | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expedienteService: ExpedienteService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.expedienteId = +params['id'];
      if (this.expedienteId) {
        this.loadExpediente();
      }
    });
  }

  loadExpediente(): void {
    if (!this.expedienteId) return;

    this.loading = true;
    this.error = null;

    this.expedienteService.getExpedienteById(this.expedienteId).subscribe({
      next: (expediente) => {
        console.log('Expediente detalle recibido:', expediente); // Debug
        this.expediente = expediente;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar expediente:', error);
        this.error = 'No se pudo cargar el expediente. Verifique que el ID sea correcto.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/expedientes']);
  }

  editarExpediente(): void {
    if (this.expedienteId) {
      this.router.navigate(['/expedientes', this.expedienteId, 'editar']);
    }
  }

  eliminarExpediente(): void {
    if (!this.expedienteId || !this.expediente) return;

    if (confirm(`¿Está seguro que desea eliminar el expediente ${this.expediente.CodigoExpediente || '#' + this.expediente.IdExpediente}?`)) {
      this.expedienteService.deleteExpediente(this.expedienteId).subscribe({
        next: () => {
          console.log('Expediente eliminado exitosamente');
          this.router.navigate(['/expedientes']);
        },
        error: (error) => {
          console.error('Error al eliminar expediente:', error);
          alert('Error al eliminar el expediente. Intente nuevamente.');
        }
      });
    }
  }
}
