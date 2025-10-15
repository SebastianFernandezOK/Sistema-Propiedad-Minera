import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitularMineroService, TitularMinero } from '../services/titular.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulares-mineros',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatTooltipModule, MatButtonModule],
  template: `
    <div class="header-section">
      <h2 class="section-title">
        <mat-icon>person</mat-icon> <!-- Added icon for consistency -->
        Titulares Mineros
      </h2>
      <button mat-raised-button color="primary" (click)="createTitular()" class="create-btn">
        <mat-icon>add</mat-icon>
        Nuevo Titular
      </button>
    </div>
    
    <table mat-table [dataSource]="titulares" class="mat-elevation-z1 full-width-table" *ngIf="titulares.length">
      <ng-container matColumnDef="IdTitular">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let titular">{{ titular.IdTitular }}</td>
      </ng-container>
      <ng-container matColumnDef="Nombre">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let titular">{{ titular.Nombre }}</td>
      </ng-container>
      <ng-container matColumnDef="TipoPersona">
        <th mat-header-cell *matHeaderCellDef>Tipo Persona</th>
        <td mat-cell *matCellDef="let titular">{{ titular.TipoPersona }}</td>
      </ng-container>
      <ng-container matColumnDef="DniCuit">
        <th mat-header-cell *matHeaderCellDef>DNI/CUIT</th>
        <td mat-cell *matCellDef="let titular">{{ titular.DniCuit }}</td>
      </ng-container>
      <ng-container matColumnDef="Email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let titular">{{ titular.Email }}</td>
      </ng-container>
      <ng-container matColumnDef="Telefono">
        <th mat-header-cell *matHeaderCellDef>Teléfono</th>
        <td mat-cell *matCellDef="let titular">{{ titular.Telefono }}</td>
      </ng-container>
      <ng-container matColumnDef="Estado">
        <th mat-header-cell *matHeaderCellDef>Estado</th>
        <td mat-cell *matCellDef="let titular">
          <span class="estado-badge" [class]="'estado-' + titular.Estado?.toLowerCase()">
            {{ titular.Estado }}
          </span>
        </td>
      </ng-container>
      <ng-container matColumnDef="FechaAsignacion">
        <th mat-header-cell *matHeaderCellDef>Fecha Asignación</th>
        <td mat-cell *matCellDef="let titular">{{ titular.FechaAsignacion | date:'dd/MM/yyyy' }}</td>
      </ng-container>
      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let titular">
          <button mat-icon-button (click)="editTitular(titular.IdTitular)" matTooltip="Editar">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteTitular(titular.IdTitular)" matTooltip="Eliminar" class="delete-btn">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <div *ngIf="!titulares.length" class="no-data">
      <p>No hay titulares registrados</p>
      <button mat-raised-button color="primary" (click)="createTitular()">
        <mat-icon>add</mat-icon>
        Crear Primer Titular
      </button>
    </div>
  `,
  styleUrls: ['./titular-list.component.scss']
})
export class TitularesMinerosComponent implements OnInit {
  titulares: TitularMinero[] = [];
  displayedColumns = [
    'IdTitular', 'Nombre', 'TipoPersona', 'DniCuit', 'Email', 'Telefono',
    'Estado', 'FechaAsignacion', 'acciones'
  ];

  constructor(
    private titularService: TitularMineroService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTitulares();
  }

  loadTitulares() {
    this.titularService.getAll().subscribe({
      next: (data) => {
        this.titulares = data;
      },
      error: (error) => {
        console.error('Error al cargar titulares:', error);
        alert('Error al cargar los titulares');
      }
    });
  }

  createTitular() {
    this.router.navigate(['/titulares/crear']);
  }

  editTitular(id: number) {
    this.router.navigate(['/titulares/editar', id]);
  }

  deleteTitular(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este titular?')) {
      this.titularService.delete(id).subscribe({
        next: () => {
          alert('Titular eliminado exitosamente');
          this.loadTitulares(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar titular:', error);
          alert('Error al eliminar el titular');
        }
      });
    }
  }
}
