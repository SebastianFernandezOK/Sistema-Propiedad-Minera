import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Observacion } from '../models/observacion.model';
import { ObservacionesService } from '../services/observaciones.service';
import { ObservacionCreateComponent } from './observacion-create.component';
import { ObservacionEditComponent } from './observacion-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-observaciones-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    ObservacionCreateComponent,
    ObservacionEditComponent
  ],
  templateUrl: './observaciones-tab.component.html',
  styleUrls: ['./observaciones-tab.component.scss'],
  styles: [`
    .header-row { display: flex; align-items: center; margin-bottom: 1rem; }
    .section-title { font-size: 1.2rem; font-weight: 600; }
    .spacer { flex: 1 1 auto; }
    .count-chip { margin-left: 0.5rem; }
    .table-container { margin-top: 1rem; }
    .no-data { color: #888; text-align: center; margin-top: 2rem; }
  `]
})
export class ObservacionesTabComponent {
  @Input() observaciones: Observacion[] = [];
  @Input() idTransaccion: number | null = null;
  @Input() loading = false;
  mostrarFormulario = false;
  editando = false;
  observacionEdit: Observacion | null = null;

  constructor(private observacionesService: ObservacionesService) {}

  onCrearObservacion(obs: Observacion) {
    this.editando = false;
    this.observacionEdit = null;
    this.observacionesService.createObservacion(obs).subscribe({
      next: (resp) => {
        this.observaciones.push(resp);
        this.mostrarFormulario = false;
      }
    });
  }

  onEditarObservacion(obs: Observacion) {
    this.observacionEdit = { ...obs };
    this.editando = true;
    this.mostrarFormulario = true;
  }

  onActualizarObservacion(obs: Observacion) {
    if (this.editando && this.observacionEdit) {
      this.observacionesService.updateObservacion(this.observacionEdit.IdTransaccion, obs).subscribe({
        next: (resp) => {
          const idx = this.observaciones.findIndex(o => o.IdTransaccion === this.observacionEdit?.IdTransaccion);
          if (idx !== -1) this.observaciones[idx] = resp;
          this.editando = false;
          this.observacionEdit = null;
          this.mostrarFormulario = false;
        }
      });
    }
  }

  onNuevaObservacion() {
    this.editando = false;
    this.observacionEdit = null;
    this.mostrarFormulario = true;
  }
}
