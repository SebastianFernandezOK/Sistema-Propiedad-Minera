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
import { AreaService } from '../services/area.service';
import { Area } from '../models/area.model';

@Component({
  selector: 'app-areas-list',
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
    <div class="areas-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>business</mat-icon>
            Gestión de Áreas
          </mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="crearArea()">
              <mat-icon>add</mat-icon>
              Nueva Área
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <!-- Loading Spinner -->
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando áreas...</p>
          </div>

          <!-- Tabla -->
          <div *ngIf="!loading" class="table-container">
            <table mat-table [dataSource]="dataSource" class="areas-table">
              <!-- ID Column -->
              <ng-container matColumnDef="IdArea">
                <th mat-header-cell *matHeaderCellDef class="id-column">ID</th>
                <td mat-cell *matCellDef="let area" class="id-column">{{ area.IdArea }}</td>
              </ng-container>

              <!-- Descripción Column -->
              <ng-container matColumnDef="Descripcion">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let area">
                  <div class="descripcion-cell">
                    <strong>{{ area.Descripcion }}</strong>
                  </div>
                </td>
              </ng-container>

              <!-- Fecha Auditoría Column -->
              <ng-container matColumnDef="AudFecha">
                <th mat-header-cell *matHeaderCellDef>Fecha Auditoría</th>
                <td mat-cell *matCellDef="let area">
                  <span class="fecha-audit">
                    {{ area.AudFecha ? (area.AudFecha | date:'dd/MM/yyyy HH:mm') : '-' }}
                  </span>
                </td>
              </ng-container>

              <!-- Acciones Column -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef class="actions-column">Acciones</th>
                <td mat-cell *matCellDef="let area" class="actions-column">
                  <button mat-icon-button 
                          color="primary" 
                          (click)="editarArea(area.IdArea); $event.stopPropagation()"
                          matTooltip="Editar área">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button 
                          color="warn" 
                          (click)="eliminarArea(area.IdArea); $event.stopPropagation()"
                          matTooltip="Eliminar área">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  class="table-row" 
                  (click)="verDetalleArea(row.IdArea)"></tr>
            </table>

            <!-- No data message -->
            <div *ngIf="dataSource.length === 0" class="no-data">
              <mat-icon>business_center</mat-icon>
              <p>No se encontraron áreas</p>
              <button mat-raised-button color="primary" (click)="crearArea()">
                Crear primera área
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
    .areas-container {
      padding: 1.5rem;
      max-width: 1200px;
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

    .areas-table {
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

    .fecha-audit {
      color: #666;
      font-size: 0.9rem;
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
export class AreasListComponent implements OnInit {
  dataSource: Area[] = [];
  displayedColumns: string[] = ['IdArea', 'Descripcion', 'AudFecha', 'acciones'];
  loading = false;
  error: string | null = null;
  
  // Paginación
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private areaService: AreaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAreas();
  }

  cargarAreas(): void {
    this.loading = true;
    this.error = null;
    
    this.areaService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.dataSource = result.data;
        this.totalItems = result.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar áreas:', err);
        this.error = 'Error al cargar las áreas';
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarAreas();
  }

  crearArea(): void {
    this.router.navigate(['/areas/nueva']);
  }

  verDetalleArea(id: number): void {
    this.router.navigate(['/areas', id]);
  }

  editarArea(id: number): void {
    this.router.navigate(['/areas', id, 'editar']);
  }

  eliminarArea(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta área?')) {
      this.areaService.delete(id).subscribe({
        next: () => {
          this.cargarAreas();
        },
        error: (err) => {
          console.error('Error al eliminar área:', err);
          alert('Error al eliminar el área');
        }
      });
    }
  }
}