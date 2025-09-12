import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoNotificacionService } from '../services/tipo-notificacion.service';
import { TipoNotificacionCreate } from '../models/tipo-notificacion.model';
import { TipoNotificacionFormComponent } from './tipo-notificacion-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tipo-notificacion-create',
  standalone: true,
  imports: [CommonModule, TipoNotificacionFormComponent, MatIconModule, MatButtonModule],
  template: `
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
      <button mat-raised-button class="back-fancy-btn" (click)="volver()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <h2 class="form-title" style="margin: 0;">Crear Tipo de Notificación</h2>
    </div>
    <app-tipo-notificacion-form (create)="onCreate($event)"></app-tipo-notificacion-form>
    <div *ngIf="success" style="color: green; margin-top: 1rem; text-align: center;">
      Tipo de notificación creado correctamente.
    </div>
    <div *ngIf="error" style="color: red; margin-top: 1rem; text-align: center;">
      Ocurrió un error al crear el tipo de notificación.
    </div>
  `,
  styles: [`
    .back-fancy-btn {
      background: linear-gradient(45deg, #416759, #5a8a73);
      color: white;
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(65, 103, 89, 0.3);
      transition: all 0.3s ease;
    }

    .back-fancy-btn:hover {
      background: linear-gradient(45deg, #355a4c, #4a7560);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(65, 103, 89, 0.4);
    }

    .back-fancy-btn mat-icon {
      font-size: 20px;
    }

    .form-title {
      color: #416759;
      font-size: 1.5rem;
      font-weight: 600;
    }
  `]
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