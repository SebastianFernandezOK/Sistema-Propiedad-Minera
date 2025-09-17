import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TipoNotificacionFormComponent } from './tipo-notificacion-form.component';
import { TipoNotificacionService } from '../services/tipo-notificacion.service';
import { TipoNotificacion, TipoNotificacionCreate } from '../models/tipo-notificacion.model';

@Component({
  selector: 'app-tipo-notificacion-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TipoNotificacionFormComponent
  ],
  template: `
    <app-tipo-notificacion-form
      [modo]="'editar'"
      [tipoNotificacion]="tipoNotificacionData"
      [form]="tipoNotificacionForm"
      (edit)="onSubmit($event)"
      (cancel)="onCancel()">
    </app-tipo-notificacion-form>
  `
})
export class TipoNotificacionEditComponent implements OnInit {
  loading = false;
  error: string | null = null;
  tipoNotificacionData: TipoNotificacion | null = null;
  tipoNotificacionId: number;
  tipoNotificacionForm: FormGroup;

  constructor(
    private tipoNotificacionService: TipoNotificacionService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.tipoNotificacionId = Number(this.route.snapshot.paramMap.get('id'));
    this.tipoNotificacionForm = this.fb.group({
      Descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      DescCorta: ['', [Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.cargarTipoNotificacion();
  }

  private cargarTipoNotificacion(): void {
    if (!this.tipoNotificacionId || isNaN(this.tipoNotificacionId)) {
      this.error = 'ID de tipo de notificación inválido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.tipoNotificacionService.getById(this.tipoNotificacionId).subscribe({
      next: (tipoNotificacion) => {
        this.tipoNotificacionData = tipoNotificacion;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tipo de notificación:', err);
        this.error = 'Error al cargar los datos del tipo de notificación. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onSubmit(tipoNotificacionData: TipoNotificacionCreate): void {
    this.loading = true;
    this.error = null;

    this.tipoNotificacionService.update(this.tipoNotificacionId, tipoNotificacionData).subscribe({
      next: (result) => {
        console.log('Tipo de notificación actualizado exitosamente:', result);
        // Navegar de vuelta a la lista
        this.router.navigate(['/tipos-notificacion']);
      },
      error: (err) => {
        console.error('Error al actualizar tipo de notificación:', err);
        this.error = 'Error al actualizar el tipo de notificación. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/tipos-notificacion']);
  }
}