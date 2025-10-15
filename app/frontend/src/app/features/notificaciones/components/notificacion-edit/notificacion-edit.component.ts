import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../services/notificacion.service';
import { NotificacionFormComponent } from '../notificacion-create/notificacion-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-notificacion-edit',
  standalone: true,
  imports: [CommonModule, NotificacionFormComponent, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
      <button mat-raised-button class="back-fancy-btn" (click)="volver()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <h2 class="form-title" style="margin: 0;">Editar Notificación</h2>
    </div>

    <!-- Loading State -->
    <div *ngIf="isLoading" style="display: flex; justify-content: center; align-items: center; min-height: 400px;">
      <mat-progress-spinner mode="indeterminate" diameter="50"></mat-progress-spinner>
    </div>

    <!-- Form -->
    <app-notificacion-form 
      *ngIf="!isLoading && notificacionData" 
      [modo]="'editar'"
      [notificacionData]="notificacionData"
      (create)="onUpdate($event)" 
      (cancel)="volver()">
    </app-notificacion-form>

    <!-- Error State -->
    <div *ngIf="!isLoading && !notificacionData" style="text-align: center; color: red; margin-top: 2rem;">
      <mat-icon style="font-size: 48px; width: 48px; height: 48px;">error</mat-icon>
      <p>No se pudo cargar la notificación</p>
      <button mat-raised-button color="primary" (click)="volver()">Volver a la lista</button>
    </div>

    <!-- Success/Error Messages -->
    <div *ngIf="success" style="color: green; margin-top: 1rem; text-align: center;">
      <mat-icon>check_circle</mat-icon>
      Notificación actualizada correctamente.
    </div>
    <div *ngIf="error" style="color: red; margin-top: 1rem; text-align: center;">
      <mat-icon>error</mat-icon>
      Ocurrió un error al actualizar la notificación.
    </div>
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

    .form-title {
      color: #416759;
      font-weight: 600;
      font-size: 1.5rem;
    }
  `]
})
export class NotificacionEditComponent implements OnInit {
  notificacionId!: number;
  notificacionData: any = null;
  isLoading = true;
  success = false;
  error = false;

  constructor(
    private notificacionService: NotificacionService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la notificación de la ruta
    this.notificacionId = Number(this.route.snapshot.params['id']);
    
    if (this.notificacionId) {
      this.loadNotificacion();
    } else {
      console.error('ID de notificación no válido');
      this.isLoading = false;
    }
  }

  private loadNotificacion(): void {
    this.notificacionService.getNotificacion(this.notificacionId).subscribe({
      next: (data: any) => {
        console.log('[DEBUG] Notificación cargada:', data);
        this.notificacionData = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar notificación:', err);
        this.isLoading = false;
        this.notificacionData = null;
      }
    });
  }

  onUpdate(notificacionActualizada: any): void {
    console.log('[DEBUG] Datos para actualizar:', notificacionActualizada);
    this.success = false;
    this.error = false;

    this.notificacionService.updateNotificacion(this.notificacionId, notificacionActualizada).subscribe({
      next: (result: any) => {
        console.log('[DEBUG] Notificación actualizada:', result);
        this.success = true;
        // Redirigir después de un momento
        setTimeout(() => this.router.navigate(['/notificaciones']), 1500);
      },
      error: (err: any) => {
        console.error('Error al actualizar notificación:', err);
        this.error = true;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/notificaciones']);
  }
}