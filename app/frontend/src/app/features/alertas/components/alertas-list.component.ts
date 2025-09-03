import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AlertaCreateComponent } from '../components/alerta-create.component';
import { AlertaEditComponent } from '../components/alerta-edit.component';
import { AlertaCreate } from '../models/alerta.model';

@Component({
  selector: 'app-alertas-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule, MatProgressSpinnerModule, MatPaginatorModule, AlertaCreateComponent, AlertaEditComponent],
  template: `
    <div>
      <div class="header-row">
        <span class="section-title">Alertas Asociadas</span>
        <mat-chip *ngIf="!mostrarFormulario && alertas.length > 0" class="count-chip">{{ alertas.length }}</mat-chip>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" *ngIf="!mostrarFormulario" (click)="mostrarFormulario = true">
          <mat-icon>add_alert</mat-icon> Nueva Alerta
        </button>
        <button mat-raised-button color="accent" *ngIf="mostrarFormulario" (click)="mostrarFormulario = false">
          <mat-icon>arrow_back</mat-icon> Volver
        </button>
      </div>
      <div *ngIf="mostrarFormulario && !editando">
        <app-alerta-create [idTransaccion]="idTransaccion" (create)="onCrearAlerta($event)"></app-alerta-create>
      </div>
      <div *ngIf="mostrarFormulario && editando">
        <app-alerta-edit [idTransaccion]="idTransaccion" [alerta]="alertaEdit" (update)="onActualizarAlerta($event)"></app-alerta-edit>
      </div>
      <div *ngIf="!mostrarFormulario">
        <div *ngIf="loading" class="loading-container">
          <mat-spinner diameter="32"></mat-spinner>
          <p>Cargando alertas...</p>
        </div>
        <div class="table-container" *ngIf="alertas.length > 0 && !loading">
          <table mat-table [dataSource]="alertas" class="alertas-table mat-elevation-4">
            <ng-container matColumnDef="idAlerta">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let alerta">{{ alerta.idAlerta }}</td>
            </ng-container>
            <ng-container matColumnDef="Estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let alerta">{{ alerta.Estado }}</td>
            </ng-container>
            <ng-container matColumnDef="Asunto">
              <th mat-header-cell *matHeaderCellDef>Asunto</th>
              <td mat-cell *matCellDef="let alerta">{{ alerta.Asunto }}</td>
            </ng-container>
            <ng-container matColumnDef="Mensaje">
              <th mat-header-cell *matHeaderCellDef>Mensaje</th>
              <td mat-cell *matCellDef="let alerta">{{ alerta.Mensaje }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let alerta">
                <button mat-icon-button color="primary" matTooltip="Ver">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="primary" matTooltip="Editar" (click)="onEditarAlerta(alerta)">
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
        <div *ngIf="alertas.length === 0 && !loading" class="no-data">
          <mat-icon>info</mat-icon>
          <p>No hay alertas asociadas a este expediente.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-row { display: flex; align-items: center; margin-bottom: 1rem; }
    .section-title { font-size: 1.2rem; font-weight: 600; }
    .spacer { flex: 1 1 auto; }
    .count-chip { margin-left: 0.5rem; }
    .table-container { margin-top: 1rem; }
    .no-data { color: #888; text-align: center; margin-top: 2rem; }
  `]
})
export class AlertasListComponent {
  private _alertas: any[] = [];
  @Input() set alertas(value: any[] | undefined) {
    this._alertas = value ?? [];
  }
  get alertas(): any[] {
    return this._alertas ?? [];
  }
  @Input() idTransaccion: number | null = null;
  @Input() loading = false;
  mostrarFormulario = false;
  editando = false;
  alertaEdit: any = null;
  displayedColumns: string[] = ['idAlerta', 'Estado', 'Asunto', 'Mensaje', 'actions'];

  onCrearAlerta(alerta: any) {
    this._alertas.push(alerta);
    this.mostrarFormulario = false;
  }

  onActualizarAlerta(alerta: any) {
    if (this.editando && this.alertaEdit) {
      const idx = this._alertas.findIndex(a => a.idAlerta === this.alertaEdit.idAlerta);
      if (idx !== -1) this._alertas[idx] = alerta;
      this.editando = false;
      this.alertaEdit = null;
      this.mostrarFormulario = false;
    }
  }

  onEditarAlerta(alerta: any) {
    this.alertaEdit = { ...alerta };
    this.editando = true;
    this.mostrarFormulario = true;
  }
}
