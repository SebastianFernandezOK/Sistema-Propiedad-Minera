import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AreaFormComponent } from './area-form.component';
import { AreaService } from '../services/area.service';
import { Area, AreaCreate } from '../models/area.model';

@Component({
  selector: 'app-area-edit',
  standalone: true,
  imports: [
    CommonModule,
    AreaFormComponent
  ],
  template: `
    <app-area-form
      [isEdit]="true"
      [initialData]="areaData"
      [loading]="loading"
      [error]="error"
      (submitForm)="onSubmit($event)"
      (cancelForm)="onCancel()">
    </app-area-form>
  `
})
export class AreaEditComponent implements OnInit {
  loading = false;
  error: string | null = null;
  areaData: Area | null = null;
  areaId: number;

  constructor(
    private areaService: AreaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.areaId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.cargarArea();
  }

  private cargarArea(): void {
    if (!this.areaId || isNaN(this.areaId)) {
      this.error = 'ID de área inválido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.areaService.getById(this.areaId).subscribe({
      next: (area) => {
        this.areaData = area;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar área:', err);
        this.error = 'Error al cargar los datos del área. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onSubmit(areaData: AreaCreate): void {
    this.loading = true;
    this.error = null;

    this.areaService.update(this.areaId, areaData).subscribe({
      next: (result) => {
        console.log('Área actualizada exitosamente:', result);
        // Navegar de vuelta a la lista
        this.router.navigate(['/areas']);
      },
      error: (err) => {
        console.error('Error al actualizar área:', err);
        this.error = 'Error al actualizar el área. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/areas']);
  }
}