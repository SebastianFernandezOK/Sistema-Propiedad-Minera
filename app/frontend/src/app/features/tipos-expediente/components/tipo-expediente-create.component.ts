import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TipoExpedienteFormComponent } from './tipo-expediente-form.component';
import { TipoExpedienteService } from '../services/tipo-expediente.service';
import { TipoExpedienteCreate } from '../models/tipo-expediente.model';

@Component({
  selector: 'app-tipo-expediente-create',
  standalone: true,
  imports: [
    CommonModule,
    TipoExpedienteFormComponent
  ],
  template: `
    <app-tipo-expediente-form
      [isEdit]="false"
      [loading]="loading"
      [error]="error"
      (submitForm)="onSubmit($event)"
      (cancelForm)="onCancel()">
    </app-tipo-expediente-form>
  `
})
export class TipoExpedienteCreateComponent {
  loading = false;
  error: string | null = null;

  constructor(
    private tipoExpedienteService: TipoExpedienteService,
    private router: Router
  ) {}

  onSubmit(tipoExpedienteData: TipoExpedienteCreate): void {
    this.loading = true;
    this.error = null;

    this.tipoExpedienteService.create(tipoExpedienteData).subscribe({
      next: (result) => {
        console.log('Tipo de expediente creado exitosamente:', result);
        // Navegar de vuelta a la lista
        this.router.navigate(['/tipos-expediente']);
      },
      error: (err) => {
        console.error('Error al crear tipo de expediente:', err);
        this.error = 'Error al crear el tipo de expediente. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/tipos-expediente']);
  }
}