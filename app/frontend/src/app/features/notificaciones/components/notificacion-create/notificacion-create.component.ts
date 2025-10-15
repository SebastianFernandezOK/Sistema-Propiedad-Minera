import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../services/notificacion.service';
import { NotificacionFormComponent } from './notificacion-form.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notificacion-create',
  standalone: true,
  imports: [CommonModule, NotificacionFormComponent, MatIconModule],
  template: `
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
      <button mat-raised-button class="back-fancy-btn" (click)="volver()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <h2 class="form-title" style="margin: 0;">Crear Notificación</h2>
    </div>
    <app-notificacion-form (create)="onCreate($event)" (cancel)="volver()"></app-notificacion-form>
    <div *ngIf="success" style="color: green; margin-top: 1rem;">Notificación creada correctamente.</div>
    <div *ngIf="error" style="color: red; margin-top: 1rem;">Ocurrió un error al crear la notificación.</div>
  `,
  styles: [`
    .back-fancy-btn {
      box-shadow: 0 2px 8px rgba(65,103,89,0.10), 0 1.5px 4px rgba(0,0,0,0.10);
      border-radius: 16px;
      background: #fff;
      color: #416759;
      border: 1.5px solid #e0e0e0;
      transition: box-shadow 0.25s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1);
    }
    .back-fancy-btn:hover {
      box-shadow: 0 4px 16px rgba(65,103,89,0.18), 0 3px 8px rgba(0,0,0,0.13);
      background: #f4faf7;
      color: #335248;
      transform: translateY(-2px) scale(1.07);
    }
  `]
})
export class NotificacionCreateComponent {
  success = false;
  error = false;

  constructor(private notificacionService: NotificacionService, private router: Router) {}

  onCreate(notificacion: any) {
    console.log('[DEBUG] Datos recibidos para crear notificación:', notificacion);
    this.success = false;
    this.error = false;
    this.notificacionService.createNotificacion(notificacion).subscribe({
      next: (result: any) => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/notificaciones']), 1200);
      },
      error: (err: any) => {
        console.error('Error al crear notificación:', err);
        this.error = true;
      }
    });
  }

  volver() {
    this.router.navigate(['/notificaciones']);
  }
}