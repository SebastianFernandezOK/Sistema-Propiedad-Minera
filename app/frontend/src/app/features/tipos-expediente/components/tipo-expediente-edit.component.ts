import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TipoExpedienteFormComponent } from './tipo-expediente-form.component';
import { TipoExpedienteService } from '../services/tipo-expediente.service';
import { TipoExpediente, TipoExpedienteCreate } from '../models/tipo-expediente.model';

@Component({
  selector: 'app-tipo-expediente-edit',
  standalone: true,
  imports: [
    CommonModule,
    TipoExpedienteFormComponent
  ],
  template: `
    <app-tipo-expediente-form
      [isEdit]="true"
      [initialData]="tipoExpedienteData"
      [loading]="loading"
      [error]="error"
      (submitForm)="onSubmit($event)"
      (cancelForm)="onCancel()">
    </app-tipo-expediente-form>
  `
})
export class TipoExpedienteEditComponent implements OnInit {
  loading = false;
  error: string | null = null;
  tipoExpedienteData: TipoExpediente | null = null;
  tipoExpedienteId: number;

  constructor(
    private tipoExpedienteService: TipoExpedienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tipoExpedienteId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.cargarTipoExpediente();
  }

  private cargarTipoExpediente(): void {
    if (!this.tipoExpedienteId || isNaN(this.tipoExpedienteId)) {
      this.error = 'ID de tipo de expediente inválido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.tipoExpedienteService.getById(this.tipoExpedienteId).subscribe({
      next: (tipoExpediente) => {
        this.tipoExpedienteData = tipoExpediente;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tipo de expediente:', err);
        this.error = 'Error al cargar los datos del tipo de expediente. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onSubmit(tipoExpedienteData: TipoExpedienteCreate): void {
    this.loading = true;
    this.error = null;

    this.tipoExpedienteService.update(this.tipoExpedienteId, tipoExpedienteData).subscribe({
      next: (result) => {
        console.log('Tipo de expediente actualizado exitosamente:', result);
        // Navegar de vuelta a la lista
        this.router.navigate(['/tipos-expediente']);
      },
      error: (err) => {
        console.error('Error al actualizar tipo de expediente:', err);
        this.error = 'Error al actualizar el tipo de expediente. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/tipos-expediente']);
  }
}