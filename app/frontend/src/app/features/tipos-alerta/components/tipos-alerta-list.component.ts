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
import { FormsModule } from '@angular/forms';
import { TipoAlertaService } from '../services/tipo-alerta.service';
import { TipoAlerta } from '../models/tipo-alerta.model';

@Component({
  selector: 'app-tipos-alerta-list',
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
    FormsModule
  ],
  template: `
    <div class="tipos-alerta-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>warning</mat-icon>
            Gestión de Tipos de Alerta
          </mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="crearTipoAlerta()">
              <mat-icon>add</mat-icon>
              Nuevo Tipo de Alerta
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <!-- Loading Spinner -->
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando tipos de alerta...</p>
          </div>

          <!-- Tabla -->
          <div *ngIf="!loading" class="table-container">
            <table mat-table [dataSource]="dataSource" class="tipos-table">
              <!-- ID Column -->
              <ng-container matColumnDef="IdTipoAlerta">
                <th mat-header-cell *matHeaderCellDef class="id-column">ID</th>
                <td mat-cell *matCellDef="let tipo" class="id-column">{{ tipo.IdTipoAlerta }}</td>
              </ng-container>

              <!-- Descripción Column -->
              <ng-container matColumnDef="Descripcion">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let tipo">
                  <div class="descripcion-cell">
                    <strong>{{ tipo.Descripcion }}</strong>
                  </div>
                </td>
              </ng-container>

              <!-- Área Column -->
              <ng-container matColumnDef="IdArea">
                <th mat-header-cell *matHeaderCellDef>Área</th>
                <td mat-cell *matCellDef="let tipo">
                  <span class="area-info">{{ tipo.IdArea || '-' }}</span>
                </td>
              </ng-container>

              <!-- Asunto Column -->
              <ng-container matColumnDef="Asunto">
                <th mat-header-cell *matHeaderCellDef>Asunto</th>
                <td mat-cell *matCellDef="let tipo">
                  <span class="asunto-text">{{ tipo.Asunto || '-' }}</span>
                </td>
              </ng-container>

              <!-- Acciones Column -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef class="actions-column">Acciones</th>
                <td mat-cell *matCellDef="let tipo" class="actions-column">
                  <button mat-icon-button 
                          color="primary" 
                          (click)="editarTipoAlerta(tipo.IdTipoAlerta); $event.stopPropagation()"
                          matTooltip="Editar tipo de alerta">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button 
                          color="warn" 
                          (click)="eliminarTipoAlerta(tipo.IdTipoAlerta); $event.stopPropagation()"
                          matTooltip="Eliminar tipo de alerta">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  class="table-row" 
                  (click)="verDetalleTipoAlerta(row.IdTipoAlerta)"></tr>
            </table>

            <!-- No data message -->
            <div *ngIf="dataSource.length === 0" class="no-data">
              <mat-icon>warning_amber</mat-icon>
              <p>No se encontraron tipos de alerta</p>
              <button mat-raised-button color="primary" (click)="crearTipoAlerta()">
                Crear primer tipo de alerta
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
    .tipos-alerta-container {
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

    .actions-column {
      width: 120px;
      text-align: center;
    }

    .descripcion-cell {
      padding: 0.5rem 0;
    }

    .area-info {
      color: #666;
      font-size: 0.9rem;
    }

    .asunto-text {
      color: #444;
      font-style: italic;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
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
  `]
})
export class TiposAlertaListComponent implements OnInit {
  dataSource: TipoAlerta[] = [];
  displayedColumns: string[] = ['IdTipoAlerta', 'Descripcion', 'IdArea', 'Asunto', 'acciones'];
  loading = false;
  error: string | null = null;
  
  // Paginación
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private tipoAlertaService: TipoAlertaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTiposAlerta();
  }

  cargarTiposAlerta(): void {
    this.loading = true;
    this.error = null;
    
    this.tipoAlertaService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.dataSource = result.data;
        this.totalItems = result.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tipos de alerta:', err);
        this.error = 'Error al cargar los tipos de alerta';
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarTiposAlerta();
  }

  crearTipoAlerta(): void {
    this.router.navigate(['/tipos-alerta/nuevo']);
  }

  verDetalleTipoAlerta(id: number): void {
    this.router.navigate(['/tipos-alerta', id]);
  }

  editarTipoAlerta(id: number): void {
    this.router.navigate(['/tipos-alerta', id, 'editar']);
  }

  eliminarTipoAlerta(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este tipo de alerta?')) {
      this.tipoAlertaService.delete(id).subscribe({
        next: () => {
          this.cargarTiposAlerta();
        },
        error: (err) => {
          console.error('Error al eliminar tipo de alerta:', err);
          alert('Error al eliminar el tipo de alerta');
        }
      });
    }
  }
}