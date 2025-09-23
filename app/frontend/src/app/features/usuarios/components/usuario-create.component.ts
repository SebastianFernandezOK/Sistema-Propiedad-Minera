import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioFormComponent } from './usuario-form.component';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioCreate } from '../models/usuario.model';

@Component({
  selector: 'app-usuario-create',
  standalone: true,
  imports: [
    CommonModule,
    UsuarioFormComponent
  ],
  template: `
    <app-usuario-form
      [isEdit]="false"
      [loading]="loading"
      [error]="error"
      (submitForm)="onSubmit($event)"
      (cancelForm)="onCancel()">
    </app-usuario-form>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class UsuarioCreateComponent {
  loading = false;
  error: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onSubmit(usuarioData: UsuarioCreate): void {
    this.loading = true;
    this.error = null;

    this.usuarioService.create(usuarioData).subscribe({
      next: (result) => {
        console.log('Usuario creado exitosamente:', result);
        // Navegar de vuelta a la lista
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.error = 'Error al crear el usuario. Por favor, intente nuevamente.';
        if (err.error?.detail) {
          this.error = err.error.detail;
        }
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/usuarios']);
  }
}