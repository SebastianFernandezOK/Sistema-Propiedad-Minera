import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioFormComponent } from './usuario-form.component';
import { UsuarioService } from '../services/usuario.service';
import { Usuario, UsuarioCreate } from '../models/usuario.model';

@Component({
  selector: 'app-usuario-edit',
  standalone: true,
  imports: [
    CommonModule,
    UsuarioFormComponent
  ],
  template: `
    <app-usuario-form
      [usuario]="usuario"
      [isEdit]="true"
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
export class UsuarioEditComponent implements OnInit {
  usuario: Usuario | null = null;
  loading = false;
  error: string | null = null;
  private usuarioId: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.usuarioId = +params['id'];
      this.loadUsuario();
    });
  }

  private loadUsuario(): void {
    this.loading = true;
    this.usuarioService.getById(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.error = 'Error al cargar el usuario. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onSubmit(usuarioData: UsuarioCreate): void {
    this.loading = true;
    this.error = null;

    // Convertir UsuarioCreate a UsuarioUpdate (sin password si no se proporciona y sin FechaCreacion)
    const updateData = {
      NombreCompleto: usuarioData.NombreCompleto,
      NombreUsuario: usuarioData.NombreUsuario,
      Email: usuarioData.Email,
      Rol: usuarioData.Rol,
      Activo: usuarioData.Activo,
      Telefono: usuarioData.Telefono,
      Observacion: usuarioData.Observacion,
      Descripcion: usuarioData.Descripcion
    };

    this.usuarioService.update(this.usuarioId, updateData).subscribe({
      next: (result) => {
        console.log('Usuario actualizado exitosamente:', result);
        // Navegar de vuelta a la lista
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.error = 'Error al actualizar el usuario. Por favor, intente nuevamente.';
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