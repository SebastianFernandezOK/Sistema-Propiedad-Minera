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
import { TipoExpedienteService } from '../services/tipo-expediente.service';
import { TipoExpediente } from '../models/tipo-expediente.model';

@Component({
  selector: 'app-tipos-expediente-list',
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
    <div class="tipos-expediente-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>folder</mat-icon>
            Gestión de Tipos de Expediente
          </mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="crearTipoExpediente()">
              <mat-icon>add</mat-icon>
              Nuevo Tipo de Expediente
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <!-- Loading Spinner -->
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando tipos de expediente...</p>
          </div>

          <!-- Tabla -->
          <div *ngIf="!loading" class="table-container">
            <table mat-table [dataSource]="dataSource" class="tipos-table">
              <!-- ID Column -->
              <ng-container matColumnDef="IdTipoExpediente">
                <th mat-header-cell *matHeaderCellDef class="id-column">ID</th>
                <td mat-cell *matCellDef="let tipo" class="id-column">{{ tipo.IdTipoExpediente }}</td>
              </ng-container>

              <!-- Nombre Column -->
              <ng-container matColumnDef="Nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let tipo">
                  <div class="nombre-cell">
                    <strong>{{ tipo.Nombre }}</strong>
                  </div>
                </td>
              </ng-container>

              <!-- Descripción Column -->
              <ng-container matColumnDef="Descripcion">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let tipo">
                  <div class="descripcion-cell">
                    {{ tipo.Descripcion | slice:0:100 }}{{ tipo.Descripcion?.length > 100 ? '...' : '' }}
                  </div>
                </td>
              </ng-container>

              <!-- Estado Column -->
              <ng-container matColumnDef="Activo">
                <th mat-header-cell *matHeaderCellDef class="estado-column">Estado</th>
                <td mat-cell *matCellDef="let tipo" class="estado-column">
                  <mat-chip [class]="tipo.Activo ? 'activo-chip' : 'inactivo-chip'">
                    <mat-icon>{{ tipo.Activo ? 'check_circle' : 'cancel' }}</mat-icon>
                    {{ tipo.Activo ? 'Activo' : 'Inactivo' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Fecha Auditoría Column -->
              <ng-container matColumnDef="AudFecha">
                <th mat-header-cell *matHeaderCellDef>Fecha Auditoría</th>
                <td mat-cell *matCellDef="let tipo">
                  <span class="fecha-audit">
                    {{ tipo.AudFecha ? (tipo.AudFecha | date:'dd/MM/yyyy HH:mm') : '-' }}
                  </span>
                </td>
              </ng-container>

              <!-- Acciones Column -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef class="actions-column">Acciones</th>
                <td mat-cell *matCellDef="let tipo" class="actions-column">
                  <button mat-icon-button 
                          color="primary" 
                          (click)="editarTipoExpediente(tipo.IdTipoExpediente)"
                          matTooltip="Editar tipo de expediente">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button 
                          color="warn" 
                          (click)="eliminarTipoExpediente(tipo.IdTipoExpediente)"
                          matTooltip="Eliminar tipo de expediente">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  class="table-row" 
                  (click)="verDetalleTipoExpediente(row.IdTipoExpediente)"></tr>
            </table>

            <!-- No data message -->
            <div *ngIf="dataSource.length === 0" class="no-data">
              <mat-icon>folder_open</mat-icon>
              <p>No se encontraron tipos de expediente</p>
              <button mat-raised-button color="primary" (click)="crearTipoExpediente()">
                Crear primer tipo de expediente
              </button>
            </div>
          </div>

          <!-- Paginador -->
          <mat-paginator 
            *ngIf="!loading && dataSource.length > 0"
            [length]="totalItems"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 25, 50]"
            [pageIndex]="currentPage"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .tipos-expediente-container {
      padding: 1.5rem;
      max-width: 1400px;
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

    .table-container {
      margin-top: 1rem;
      overflow-x: auto;
    }

    .tipos-table {
      width: 100%;
      background: white;
    }

    .id-column {
      width: 80px;
      text-align: center;
    }

    .estado-column {
      width: 120px;
      text-align: center;
    }

    .actions-column {
      width: 120px;
      text-align: center;
    }

    .nombre-cell {
      padding: 0.5rem 0;
      color: #333;
    }

    .descripcion-cell {
      padding: 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .fecha-audit {
      color: #666;
      font-size: 0.9rem;
    }

    .activo-chip {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .inactivo-chip {
      background-color: #ffebee;
      color: #c62828;
    }

    .activo-chip mat-icon,
    .inactivo-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    .table-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .table-row:hover {
      background-color: #f5f5f5;
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #ccc;
      margin-bottom: 1rem;
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

    .header-actions button {
      background: #416759;
      color: white;
    }

    .header-actions button:hover {
      background: #355a4c;
    }

    .mat-mdc-chip {
      font-size: 0.75rem;
      min-height: 24px;
      display: flex;
      align-items: center;
    }
  `]
})
export class TiposExpedienteListComponent implements OnInit {
  dataSource: TipoExpediente[] = [];
  displayedColumns: string[] = ['IdTipoExpediente', 'Nombre', 'Descripcion', 'Activo', 'AudFecha', 'acciones'];
  loading = false;
  error: string | null = null;
  
  // Paginación
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private tipoExpedienteService: TipoExpedienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTiposExpediente();
  }

  cargarTiposExpediente(): void {
    this.loading = true;
    this.error = null;
    
    this.tipoExpedienteService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.dataSource = result.data;
        this.totalItems = result.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tipos de expediente:', err);
        this.error = 'Error al cargar los tipos de expediente';
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarTiposExpediente();
  }

  crearTipoExpediente(): void {
    this.router.navigate(['/tipos-expediente/nuevo']);
  }

  verDetalleTipoExpediente(id: number): void {
    this.router.navigate(['/tipos-expediente', id]);
  }

  editarTipoExpediente(id: number): void {
    this.router.navigate(['/tipos-expediente', id, 'editar']);
  }

  eliminarTipoExpediente(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este tipo de expediente?')) {
      this.tipoExpedienteService.delete(id).subscribe({
        next: () => {
          // Recargar la lista después de eliminar
          this.cargarTiposExpediente();
          // Mostrar mensaje de éxito
          alert('Tipo de expediente eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar tipo de expediente:', err);
          alert('Error al eliminar el tipo de expediente');
        }
      });
    }
  }
}