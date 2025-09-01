import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActaService, ActaDetalleResponse } from '../services/acta.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-acta-detalle',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatProgressSpinnerModule, MatTabsModule, MatListModule, MatIconModule, MatDividerModule],
  template: `
    <div class="acta-detail-container">
      <div *ngIf="loading" class="loading-container">
        <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
        <p>Cargando acta...</p>
      </div>
      <div *ngIf="!loading && acta">
        <div class="detail-header">
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>{{ acta.Descripcion || 'Acta' }}</h1>
        </div>
        <mat-tab-group>
          <mat-tab label="Información General">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Datos Básicos</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>ID Acta:</label>
                      <span>{{ acta.IdActa }}</span>
                    </div>
                    <div class="info-item">
                      <label>Fecha:</label>
                      <span>{{ acta.Fecha ? (acta.Fecha | date:'dd/MM/yyyy') : 'Sin fecha' }}</span>
                    </div>
                    <div class="info-item">
                      <label>Tipo:</label>
                      <span>{{ acta.IdTipoActa || 'Sin tipo' }}</span>
                    </div>
                    <div class="info-item">
                      <label>Lugar:</label>
                      <span>{{ acta.Lugar || 'Sin lugar' }}</span>
                    </div>
                    <div class="info-item">
                      <label>Autoridad:</label>
                      <span>{{ acta.IdAutoridad || 'Sin autoridad' }}</span>
                    </div>
                    <div class="info-item">
                      <label>Descripción:</label>
                      <span>{{ acta.Descripcion || 'Sin descripción' }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
          <mat-tab label="Alertas">
            <div class="tab-content">
              <div *ngIf="acta.alertas && acta.alertas.length > 0" class="alertas-section">
                <mat-list>
                  <mat-list-item *ngFor="let alerta of acta.alertas">
                    <mat-icon matListIcon color="primary">warning</mat-icon>
                    <div matLine><b>{{ alerta.Asunto || 'Alerta' }}</b></div>
                    <div matLine>{{ alerta.Mensaje }}</div>
                    <mat-chip color="primary" *ngIf="alerta.Estado">{{ alerta.Estado }}</mat-chip>
                  </mat-list-item>
                </mat-list>
              </div>
              <div *ngIf="!acta.alertas || acta.alertas.length === 0" class="alertas-section">
                <em>No hay alertas asociadas a esta acta.</em>
              </div>
            </div>
          </mat-tab>
          <mat-tab label="Observaciones">
            <div class="tab-content">
              <mat-card>
                <mat-card-content>
                  <div><b>Observaciones:</b></div>
                  <div>{{ acta.Obs || 'Sin observaciones' }}</div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
          <mat-tab label="Archivos">
            <div class="tab-content">
              <mat-card>
                <mat-card-content>
                  <div><b>Archivos:</b></div>
                  <div><em>(Aquí va el listado o integración de archivos asociados al acta)</em></div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .acta-detail-container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e0e0e0; }
    .detail-header h1 { flex: 1; margin: 0; font-size: 28px; font-weight: 500; }
    .back-button { color: #666; }
    .tab-content { padding: 24px 0; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-top: 16px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .alertas-section { margin-top: 16px; }
    mat-chip { margin-left: 8px; background: #416759; color: #fff; }
    mat-list-item { margin-bottom: 8px; }
    em { color: #888; }
  `]
})
export class ActaDetalleComponent implements OnInit {
  acta: ActaDetalleResponse | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actaService: ActaService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('actaId'));
    if (id) {
      this.actaService.getActaById(id).subscribe({
        next: (resp: ActaDetalleResponse) => {
          this.acta = resp;
          this.loading = false;
        },
        error: () => {
          this.acta = null;
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/expedientes']);
  }
}
