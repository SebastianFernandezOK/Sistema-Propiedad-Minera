import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoNotificacionService } from '../services/tipo-notificacion.service';
import { TipoNotificacionCreate } from '../models/tipo-notificacion.model';
import { TipoNotificacionFormComponent } from './tipo-notificacion-form.component';

@Component({
  selector: 'app-tipo-notificacion-create',
  standalone: true,
  imports: [CommonModule, TipoNotificacionFormComponent],
  template: `
    <app-tipo-notificacion-form 
      (create)="onCreate($event)"
      (cancel)="volver()">
    </app-tipo-notificacion-form>
    <div *ngIf="success" style="color: green; margin-top: 1rem; text-align: center;">
      Tipo de notificación creado correctamente.
    </div>
    <div *ngIf="error" style="color: red; margin-top: 1rem; text-align: center;">
      Ocurrió un error al crear el tipo de notificación.
    </div>
  `,
  styles: []
})
export class TipoNotificacionCreateComponent {
  success = false;
  error = false;

  constructor(
    private tipoNotificacionService: TipoNotificacionService, 
    private router: Router
  ) {}

  onCreate(tipoNotificacion: TipoNotificacionCreate) {
    this.success = false;
    this.error = false;
    
    this.tipoNotificacionService.create(tipoNotificacion).subscribe({
      next: (result) => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/tipos-notificacion']), 1200);
      },
      error: (err) => {
        console.error('Error al crear tipo de notificación:', err);
        this.error = true;
      }
    });
  }

  volver() {
    this.router.navigate(['/tipos-notificacion']);
  }
}