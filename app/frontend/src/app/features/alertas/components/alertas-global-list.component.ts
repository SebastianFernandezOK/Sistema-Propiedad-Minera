import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlertaGlobalService } from '../services/alerta-global.service';
import { EstadoAlertaService } from '../services/estado-alerta.service';
import { EstadoAlerta } from '../models/estado-alerta.model';

@Component({
  selector: 'app-alertas-global-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="alertas-container">
      <h2>Alertas del Sistema</h2>
      
      <!-- Filtros -->
      <div class="filters-container">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Estado</mat-label>
          <mat-select [(value)]="selectedEstado" (selectionChange)="onFilterChange()">
            <mat-option value="">Todos los estados</mat-option>
            <mat-option *ngFor="let estado of estadosAlerta" [value]="estado.IdEstado">
              {{ estado.nombre }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button (click)="clearFilter()" title="Limpiar filtro" class="clear-filter-btn">
          <mat-icon>clear</mat-icon>
        </button>
      </div>
      
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="32"></mat-spinner>
        <p>Cargando alertas...</p>
      </div>
      <div class="table-container" *ngIf="!loading && alertas.length > 0">
        <table mat-table [dataSource]="alertas" class="mat-elevation-2">
          <!-- <ng-container matColumnDef="idAlerta">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let alerta">{{ alerta.idAlerta }}</td>
          </ng-container> -->
          <ng-container matColumnDef="FechaInicio">
            <th mat-header-cell *matHeaderCellDef>Fecha de inicio</th>
            <td mat-cell *matCellDef="let alerta">{{ alerta.FechaInicio ? (alerta.FechaInicio | date:'dd/MM/yyyy HH:mm') : '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="FechaFin">
            <th mat-header-cell *matHeaderCellDef>Fecha fin</th>
            <td mat-cell *matCellDef="let alerta">{{ alerta.FechaFin ? (alerta.FechaFin | date:'dd/MM/yyyy HH:mm') : '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="Estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let alerta">{{ alerta.estado_nombre }}</td>
          </ng-container>
          <ng-container matColumnDef="Asunto">
            <th mat-header-cell *matHeaderCellDef>Asunto</th>
            <td mat-cell *matCellDef="let alerta">{{ alerta.Asunto }}</td>
          </ng-container>
          <ng-container matColumnDef="Mensaje">
            <th mat-header-cell *matHeaderCellDef>Mensaje</th>
            <td mat-cell *matCellDef="let alerta">{{ alerta.Mensaje }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
      <div *ngIf="!loading && alertas.length === 0" class="no-data">
        <p>No hay alertas en el sistema.</p>
      </div>
      <mat-paginator *ngIf="totalAlertas > 0" [length]="totalAlertas" [pageSize]="pageSize" [pageSizeOptions]="[5, 10, 25]" (page)="onPageChange($event)"></mat-paginator>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      border-radius: 8px;
      padding: 24px;
    }
    .filters-container {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: center;
    }
    .filter-field {
      min-width: 200px;
    }
    .clear-filter-btn {
      color: #666;
    }
    .loading-container { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
    .table-container { overflow-x: auto; margin-top: 1rem; }
    .no-data { color: #888; font-style: italic; margin-top: 16px; }
  `]
})
export class AlertasGlobalListComponent implements OnInit {
  alertas: any[] = [];
  totalAlertas = 0;
  pageSize = 10;
  currentPage = 0;
  loading = false;
  displayedColumns: string[] = ['FechaInicio', 'FechaFin', 'Estado', 'Asunto', 'Mensaje'];
  
  // Filtro por estado
  estadosAlerta: any[] = [];
  selectedEstado: number | string = 1; // Pendiente por defecto

  constructor(
    private alertaGlobalService: AlertaGlobalService,
    private estadoAlertaService: EstadoAlertaService
  ) {}

  ngOnInit() {
    this.loadEstadosAlerta();
    this.loadAlertas();
  }

  loadEstadosAlerta() {
    this.estadoAlertaService.getEstadosAlerta().subscribe({
      next: (estados) => {
        this.estadosAlerta = estados;
      },
      error: (error) => {
        console.error('Error cargando estados de alerta:', error);
      }
    });
  }

  loadAlertas(page: number = 0, size: number = this.pageSize) {
    this.loading = true;
    
    // Convertir a string si es necesario
    const estadoParam = this.selectedEstado ? this.selectedEstado.toString() : '';
    
    this.alertaGlobalService.getAllPaginated(page, size, estadoParam).subscribe({
      next: (resp) => {
        this.alertas = resp.data;
        this.totalAlertas = resp.total;
        this.loading = false;
      },
      error: () => {
        this.alertas = [];
        this.totalAlertas = 0;
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.currentPage = 0;
    this.loadAlertas(0, this.pageSize);
  }

  clearFilter() {
    this.selectedEstado = '';
    this.onFilterChange();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAlertas(this.currentPage, this.pageSize);
  }
}
