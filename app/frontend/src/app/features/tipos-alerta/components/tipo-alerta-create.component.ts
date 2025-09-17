import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoAlertaService } from '../services/tipo-alerta.service';
import { TipoAlertaCreate } from '../models/tipo-alerta.model';
import { TipoAlertaFormComponent } from './tipo-alerta-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tipo-alerta-create',
  standalone: true,
  imports: [CommonModule, TipoAlertaFormComponent, MatIconModule, MatButtonModule],
  template: `
    <app-tipo-alerta-form (create)="onCreate($event)" (cancel)="volver()"></app-tipo-alerta-form>
    <div *ngIf="success" style="color: green; margin-top: 1rem; text-align: center;">
      Tipo de alerta creado correctamente.
    </div>
    <div *ngIf="error" style="color: red; margin-top: 1rem; text-align: center;">
      Ocurrió un error al crear el tipo de alerta.
    </div>
  `,
  styles: [`
    /* Estilos movidos al formulario */
  `]
})
export class TipoAlertaCreateComponent {
  success = false;
  error = false;

  constructor(
    private tipoAlertaService: TipoAlertaService, 
    private router: Router
  ) {}

  onCreate(tipoAlerta: TipoAlertaCreate) {
    this.success = false;
    this.error = false;
    
    this.tipoAlertaService.create(tipoAlerta).subscribe({
      next: (result) => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/tipos-alerta']), 1200);
      },
      error: (err) => {
        console.error('Error al crear tipo de alerta:', err);
        this.error = true;
      }
    });
  }

  volver() {
    this.router.navigate(['/tipos-alerta']);
  }
}