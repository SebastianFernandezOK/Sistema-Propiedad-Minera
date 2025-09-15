import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AreaFormComponent } from './area-form.component';
import { AreaService } from '../services/area.service';
import { AreaCreate } from '../models/area.model';

@Component({
  selector: 'app-area-create',
  standalone: true,
  imports: [
    CommonModule,
    AreaFormComponent
  ],
  template: `
    <app-area-form
      [isEdit]="false"
      [loading]="loading"
      [error]="error"
      (submitForm)="onSubmit($event)"
      (cancelForm)="onCancel()">
    </app-area-form>
  `
})
export class AreaCreateComponent {
  loading = false;
  error: string | null = null;

  constructor(
    private areaService: AreaService,
    private router: Router
  ) {}

  onSubmit(areaData: AreaCreate): void {
    this.loading = true;
    this.error = null;

    this.areaService.create(areaData).subscribe({
      next: (result) => {
        console.log('Área creada exitosamente:', result);
        // Navegar de vuelta a la lista
        this.router.navigate(['/areas']);
      },
      error: (err) => {
        console.error('Error al crear área:', err);
        this.error = 'Error al crear el área. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/areas']);
  }
}