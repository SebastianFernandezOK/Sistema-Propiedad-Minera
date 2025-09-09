import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { PropiedadMineraService } from '../services/propiedad-minera.service';
import { ReqMineroMovService, ReqMineroMov, ReqMineroMovCreate } from '../services/req-minero-mov.service';
import { PropiedadMinera } from '../models/propiedad-minera.model';
import { ReqMineroMovCreateComponent } from './req-minero-mov/req-minero-mov-create.component';
import { ReqMineroMovEditComponent } from './req-minero-mov/req-minero-mov-edit.component';

@Component({
  selector: 'app-propiedad-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    ReqMineroMovCreateComponent,
    ReqMineroMovEditComponent
  ],
  template: `
    <div class="detail-container">
      <!-- Header -->
      <div class="detail-header">
        <div class="header-content">
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="header-info">
            <h1 *ngIf="propiedad">{{ propiedad.Nombre || 'Propiedad Minera' }}</h1>
            <h1 *ngIf="!propiedad && !loading">Propiedad Minera</h1>
            <p class="subtitle" *ngIf="propiedad">ID: {{ propiedad.IdPropiedadMinera }}</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Cargando datos de la propiedad...</p>
      </div>

      <!-- Content with Tabs -->
      <div *ngIf="!loading && propiedad" class="tabs-container">
        <mat-tab-group animationDuration="300ms">
          <!-- Tab 1: Datos de Propiedad Minera -->
          <mat-tab label="Datos de Propiedad">
            <div class="tab-content">
              <mat-card class="info-card">
                <mat-card-header>
                  <mat-card-title>Información General</mat-card-title>
                  <div class="spacer"></div>
                  <button mat-raised-button color="primary" (click)="editPropiedad()" *ngIf="propiedad">
                    <mat-icon>edit</mat-icon>
                    Editar Propiedad
                  </button>
                </mat-card-header>
                <mat-card-content>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Nombre:</label>
                      <span>{{ propiedad.Nombre || 'No especificado' }}</span>
                    </div>
                    <div class="info-item">
                      <label>ID Titular:</label>
                      <span>{{ propiedad.IdTitular || 'No asignado' }}</span>
                    </div>
                    <div class="info-item">
                      <label>Provincia:</label>
                      <span>{{ propiedad.Provincia || 'No especificada' }}</span>
                    </div>
                    <div class="info-item">
                      <label>Área (Hectáreas):</label>
                      <span>{{ propiedad.AreaHectareas || 'No especificada' }}</span>
                    </div>
                    <div class="info-item">
                      <label>Descubrimiento Directo:</label>
                      <span>{{ propiedad.DescubrimientoDirecto || 'No especificado' }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="info-card">
                <mat-card-header>
                  <mat-card-title>Fechas Importantes</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Fecha de Solicitud:</label>
                      <span>{{ formatDate(propiedad.Solicitud) }}</span>
                    </div>
                    <div class="info-item">
                      <label>Fecha de Registro:</label>
                      <span>{{ formatDate(propiedad.Registro) }}</span>
                    </div>
                    <div class="info-item">
                      <label>Fecha de Notificación:</label>
                      <span>{{ formatDate(propiedad.Notificacion) }}</span>
                    </div>
                    <div class="info-item">
                      <label>Fecha de Mensura:</label>
                      <span>{{ formatDate(propiedad.Mensura) }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="info-card">
                <mat-card-header>
                  <mat-card-title>Información de Transacción</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>ID Transacción:</label>
                      <span>{{ propiedad.IdTransaccion || 'No asignada' }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Tab 2: Requerimientos Mineros -->
          <mat-tab label="Requerimientos Mineros">
            <div class="tab-content">
              <!-- Formulario de creación (solo si está activo) -->
              <div *ngIf="mostrandoFormularioCreacion" class="formulario-container">
                <app-req-minero-mov-create 
                  [idPropiedadMinera]="propiedadId"
                  (create)="onCrearRequerimiento($event)"
                  (cancelar)="ocultarFormularioCreacion()">
                </app-req-minero-mov-create>
              </div>

              <!-- Formulario de edición (solo si está activo) -->
              <div *ngIf="mostrandoFormularioEdicion && requerimientoEnEdicion" class="formulario-container">
                <app-req-minero-mov-edit 
                  [reqMineroMov]="requerimientoEnEdicion"
                  (update)="onActualizarRequerimiento($event)"
                  (cancelar)="ocultarFormularioEdicion()">
                </app-req-minero-mov-edit>
              </div>

              <!-- Lista de requerimientos (solo si no hay formularios activos) -->
              <mat-card class="info-card" *ngIf="!mostrandoFormularioCreacion && !mostrandoFormularioEdicion">
                <mat-card-header>
                  <mat-card-title>Requerimientos Mineros</mat-card-title>
                  <mat-card-subtitle>Documentos y requisitos de la propiedad minera</mat-card-subtitle>
                  <div class="spacer"></div>
                  <button mat-raised-button 
                          color="accent" 
                          (click)="mostrarFormularioCreacion()"
                          class="btn-nuevo-requerimiento">
                    <mat-icon>add</mat-icon>
                    Nuevo Requerimiento
                  </button>
                </mat-card-header>
                <mat-card-content>
                  <!-- Loading de requerimientos -->
                  <div *ngIf="loadingRequerimientos" class="loading-requerimientos">
                    <mat-spinner diameter="40"></mat-spinner>
                    <p>Cargando requerimientos...</p>
                  </div>

                  <!-- Tabla de requerimientos -->
                  <div *ngIf="!loadingRequerimientos" class="requerimientos-table">
                    <table mat-table [dataSource]="requerimientos" class="full-width-table">
                      <!-- Columna Fecha -->
                      <ng-container matColumnDef="fecha">
                        <th mat-header-cell *matHeaderCellDef>Fecha</th>
                        <td mat-cell *matCellDef="let req">
                          {{ formatDate(req.Fecha) }}
                        </td>
                      </ng-container>

                      <!-- Columna Descripción -->
                      <ng-container matColumnDef="descripcion">
                        <th mat-header-cell *matHeaderCellDef>Descripción</th>
                        <td mat-cell *matCellDef="let req">
                          {{ req.Descripcion || 'Sin descripción' }}
                        </td>
                      </ng-container>

                      <!-- Columna Importe -->
                      <ng-container matColumnDef="importe">
                        <th mat-header-cell *matHeaderCellDef>Importe</th>
                        <td mat-cell *matCellDef="let req">
                          <span *ngIf="req.Importe" class="importe">
                            {{ formatCurrency(req.Importe) }}
                          </span>
                          <span *ngIf="!req.Importe" class="no-importe">-</span>
                        </td>
                      </ng-container>

                      <!-- Columna Acciones -->
                      <ng-container matColumnDef="acciones">
                        <th mat-header-cell *matHeaderCellDef>Acciones</th>
                        <td mat-cell *matCellDef="let req">
                          <button mat-icon-button [matMenuTriggerFor]="reqMenu" 
                                  [matMenuTriggerData]="{requerimiento: req}">
                            <mat-icon>more_vert</mat-icon>
                          </button>
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="requerimientosColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: requerimientosColumns;"></tr>
                    </table>

                    <!-- Mensaje si no hay requerimientos -->
                    <div *ngIf="requerimientos.length === 0" class="no-requerimientos">
                      <mat-icon>assignment</mat-icon>
                      <h3>No hay requerimientos registrados</h3>
                      <p>Aún no se han agregado requerimientos para esta propiedad minera.</p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>

      <!-- Menú de acciones para requerimientos -->
      <mat-menu #reqMenu="matMenu">
        <ng-template matMenuContent let-requerimiento="requerimiento">
          <button mat-menu-item (click)="editarRequerimiento(requerimiento)">
            <mat-icon>edit</mat-icon>
            <span>Editar</span>
          </button>
          <button mat-menu-item (click)="verDetalleRequerimiento(requerimiento)">
            <mat-icon>visibility</mat-icon>
            <span>Ver Detalle</span>
          </button>
          <button mat-menu-item (click)="eliminarRequerimiento(requerimiento)">
            <mat-icon>delete</mat-icon>
            <span>Eliminar</span>
          </button>
        </ng-template>
      </mat-menu>

      <!-- Error State -->
      <div *ngIf="!loading && !propiedad" class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <h2>Propiedad no encontrada</h2>
        <p>No se pudo cargar la información de la propiedad minera.</p>
        <button mat-raised-button color="primary" (click)="goBack()">
          Volver al listado
        </button>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e0e0e0;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-button {
      color: #666;
    }

    .header-info h1 {
      margin: 0;
      color: #3f51b5;
      font-size: 1.8rem;
      font-weight: 500;
    }

    .subtitle {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    .tabs-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .tab-content {
      padding: 24px;
      min-height: 400px;
    }

    .formulario-container {
      margin-bottom: 24px;
    }

    .info-card {
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .info-card mat-card-header {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
    }

    .info-card mat-card-header button {
      z-index: 10;
      pointer-events: auto;
    }

    .btn-nuevo-requerimiento {
      cursor: pointer !important;
      user-select: none;
    }

    .spacer {
      flex: 1;
    }

    .info-card:last-child {
      margin-bottom: 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
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
      font-size: 0.9rem;
    }

    .info-item span {
      color: #333;
      font-size: 1rem;
    }

    .requerimientos-container {
      margin-top: 16px;
    }

    .requerimiento-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 0;
    }

    .requerimiento-info {
      flex: 1;
    }

    .requerimiento-info h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.1rem;
    }

    .requerimiento-info p {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .status {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status.completed {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status.pending {
      background: #fff3e0;
      color: #f57c00;
    }

    .status.in-progress {
      background: #e3f2fd;
      color: #1976d2;
    }



    .loading-requerimientos {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
    }

    .loading-requerimientos p {
      margin-top: 16px;
      color: #666;
    }

    .requerimientos-table {
      margin-top: 16px;
    }

    .full-width-table {
      width: 100%;
    }

    .full-width-table th,
    .full-width-table td {
      padding: 12px 8px;
    }

    .importe {
      font-weight: 500;
      color: #2e7d32;
    }

    .no-importe {
      color: #999;
      font-style: italic;
    }

    .no-requerimientos {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      color: #666;
    }

    .no-requerimientos mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #ccc;
    }

    .no-requerimientos h3 {
      margin: 0 0 8px 0;
      font-weight: 500;
    }

    .no-requerimientos p {
      margin: 0;
      font-size: 0.9rem;
    }

    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
    }

    .error-container mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .error-container h2 {
      margin: 0 0 8px 0;
      color: #666;
    }

    .error-container p {
      margin: 0 0 24px 0;
      color: #999;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .detail-container {
        padding: 16px;
      }

      .detail-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .header-content {
        width: 100%;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-end;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PropiedadDetailComponent implements OnInit {
  propiedad: PropiedadMinera | null = null;
  loading = true;
  propiedadId: number | null = null;
  
  // Requerimientos
  requerimientos: ReqMineroMov[] = [];
  loadingRequerimientos = false;
  requerimientosColumns: string[] = ['fecha', 'descripcion', 'importe', 'acciones'];

  // Estados de formularios
  mostrandoFormularioCreacion = false;
  mostrandoFormularioEdicion = false;
  requerimientoEnEdicion: ReqMineroMov | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propiedadService: PropiedadMineraService,
    private reqMineroMovService: ReqMineroMovService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propiedadId = +params['id'];
      if (this.propiedadId) {
        this.loadPropiedad(this.propiedadId);
      } else {
        this.loading = false;
      }
    });
  }

  loadPropiedad(id: number) {
    this.loading = true;
    this.propiedadService.getPropiedadById(id).subscribe({
      next: (propiedad: PropiedadMinera) => {
        this.propiedad = propiedad;
        this.loading = false;
        // Cargar requerimientos cuando se carga la propiedad
        this.loadRequerimientos(id);
      },
      error: (error: any) => {
        console.error('Error al cargar propiedad:', error);
        this.loading = false;
      }
    });
  }

  loadRequerimientos(idPropiedadMinera: number) {
    this.loadingRequerimientos = true;
    this.reqMineroMovService.getReqMineroMovsByPropiedad(idPropiedadMinera).subscribe({
      next: (result) => {
        this.requerimientos = result.data;
        this.loadingRequerimientos = false;
      },
      error: (error: any) => {
        console.error('Error al cargar requerimientos:', error);
        this.requerimientos = [];
        this.loadingRequerimientos = false;
      }
    });
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'No especificada';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  }

  // Métodos para manejar formularios
  mostrarFormularioCreacion() {
    console.log('mostrarFormularioCreacion called'); // Debug
    this.mostrandoFormularioCreacion = true;
    this.mostrandoFormularioEdicion = false;
    this.requerimientoEnEdicion = null;
  }

  ocultarFormularioCreacion() {
    this.mostrandoFormularioCreacion = false;
  }

  mostrarFormularioEdicion(requerimiento: ReqMineroMov) {
    this.mostrandoFormularioCreacion = false;
    this.mostrandoFormularioEdicion = true;
    this.requerimientoEnEdicion = { ...requerimiento };
  }

  ocultarFormularioEdicion() {
    this.mostrandoFormularioEdicion = false;
    this.requerimientoEnEdicion = null;
  }

  onCrearRequerimiento(reqData: ReqMineroMovCreate) {
    if (!this.propiedadId) return;

    this.reqMineroMovService.createReqMineroMovForPropiedad(this.propiedadId, reqData).subscribe({
      next: (response) => {
        console.log('Requerimiento creado exitosamente:', response);
        this.ocultarFormularioCreacion();
        this.loadRequerimientos(this.propiedadId!);
      },
      error: (error) => {
        console.error('Error al crear requerimiento:', error);
        alert('Error al crear el requerimiento. Por favor, intente nuevamente.');
      }
    });
  }

  onActualizarRequerimiento(reqData: Partial<ReqMineroMovCreate>) {
    if (!this.requerimientoEnEdicion?.IdReqMineroMov) return;

    this.reqMineroMovService.updateReqMineroMov(this.requerimientoEnEdicion.IdReqMineroMov, reqData).subscribe({
      next: (response) => {
        console.log('Requerimiento actualizado exitosamente:', response);
        this.ocultarFormularioEdicion();
        this.loadRequerimientos(this.propiedadId!);
      },
      error: (error) => {
        console.error('Error al actualizar requerimiento:', error);
        alert('Error al actualizar el requerimiento. Por favor, intente nuevamente.');
      }
    });
  }

  // Métodos para acciones de requerimientos
  agregarRequerimiento() {
    this.mostrarFormularioCreacion();
  }

  editarRequerimiento(requerimiento: ReqMineroMov) {
    this.mostrarFormularioEdicion(requerimiento);
  }

  verDetalleRequerimiento(requerimiento: ReqMineroMov) {
    console.log('Ver detalle requerimiento:', requerimiento);
    // TODO: Implementar modal de detalle
    alert(`Detalle requerimiento: ${requerimiento.Descripcion}`);
  }

  eliminarRequerimiento(requerimiento: ReqMineroMov) {
    if (confirm(`¿Está seguro de que desea eliminar el requerimiento "${requerimiento.Descripcion}"?`)) {
      this.reqMineroMovService.deleteReqMineroMov(requerimiento.IdReqMineroMov).subscribe({
        next: () => {
          console.log('Requerimiento eliminado correctamente');
          // Recargar la lista de requerimientos
          if (this.propiedadId) {
            this.loadRequerimientos(this.propiedadId);
          }
        },
        error: (error: any) => {
          console.error('Error al eliminar requerimiento:', error);
          alert('Error al eliminar el requerimiento');
        }
      });
    }
  }

  exportarRequerimientos() {
    console.log('Exportar requerimientos');
    // TODO: Implementar exportación
    alert('Función de exportar requerimientos - Por implementar');
  }

  recargarRequerimientos() {
    if (this.propiedadId) {
      this.loadRequerimientos(this.propiedadId);
    }
  }

  goBack() {
    this.router.navigate(['/propiedades']);
  }

  editPropiedad() {
    if (this.propiedadId) {
      this.router.navigate(['/propiedades', this.propiedadId, 'editar']);
    }
  }
}
