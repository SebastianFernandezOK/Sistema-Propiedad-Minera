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
  styleUrls: ['./areas-list.component.scss']
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