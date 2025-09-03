import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule, DatePipe } from '@angular/common';
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

import { ExpedienteService } from '../services/expediente.service';
import { Expediente } from '../models/expediente.model';
import { ActasComponent } from '../../actas/components/actas.component';
import { ResolucionesListComponent } from '../../resoluciones/components/resoluciones-list.component';
import { ObservacionesTabComponent } from '../../observaciones/components/observaciones-tab.component';
import { AlertaCreateComponent } from '../../alertas/components/alerta-create.component';
import { AlertasListComponent } from '../../alertas/components/alertas-list.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-expediente-detail',
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
  DatePipe,
  ActasComponent,
  ResolucionesListComponent,
  ObservacionesTabComponent,
  AlertasListComponent,
  ReactiveFormsModule
  ],
  templateUrl: './expediente-detail.component.html',
  styleUrls: ['./expediente-detail.component.scss'],
  animations: [
    trigger('slideContent', [
      state('void', style({ transform: 'translateY(-20px)', opacity: 0 })),
      state('*', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => *', [
        animate('300ms ease-out')
      ]),
      transition('* => void', [
        animate('200ms ease-in')
      ])
    ])
  ]
})
export class ExpedienteDetailComponent implements OnInit {
  mostrarFormularioAlerta = false;
  onCrearAlerta(alerta: any) {
    console.log('[ExpedienteDetail] Recibido evento create alerta:', alerta);
    if (this.expediente) {
      if (!this.expediente.alertas) this.expediente.alertas = [];
      this.expediente.alertas.push({ ...alerta, idAlerta: Math.floor(Math.random() * 100000) });
      this.tabs[3].chipValue = this.expediente.alertas.length;
    }
    this.mostrarFormularioAlerta = false;
  }
  expediente: Expediente | null = null;
  loading = false;
  error: string | null = null;
  expedienteId: number | null = null;

  tabs = [
    { label: 'Información General', icon: 'info', chip: false },
    { label: 'Actas', icon: 'description', chip: false },
    { label: 'Resoluciones', icon: 'gavel', chip: false },
    { label: 'Alertas', icon: 'warning', chip: true, chipValue: 0 },
    { label: 'Observaciones', icon: 'note', chip: false } // Nuevo tab de Observaciones
  ];
  selectedTabIndex = 0;

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
        this.expediente = expediente;
        // Actualizar chip de alertas
        this.tabs[3].chipValue = expediente.alertas?.length || 0;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'No se pudo cargar el expediente. Verifique que el ID sea correcto.';
        this.loading = false;
      }
    });
  }

  selectTab(index: number): void {
    this.selectedTabIndex = index;
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

  const mensaje = 'Esta seguro que desea eliminar el expediente ' + (this.expediente.CodigoExpediente || ('#' + this.expediente.IdExpediente)) + '?';
  if (confirm(mensaje)) {
      this.expedienteService.deleteExpediente(this.expedienteId).subscribe({
        next: () => {
          this.router.navigate(['/expedientes']);
        },
        error: (error) => {
          alert('Error al eliminar el expediente. Intente nuevamente.');
        }
      });
    }
  }
}
