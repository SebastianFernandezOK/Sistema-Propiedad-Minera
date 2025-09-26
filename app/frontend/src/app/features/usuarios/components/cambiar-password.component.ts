import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <mat-card-title class="form-title">
            Cambiar Contraseña
          </mat-card-title>
          <button mat-raised-button color="primary" type="button" (click)="onCancel()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
            Volver
          </button>
        </div>

        <mat-card-content *ngIf="usuario">
          <div class="user-info">
            <h3>{{ usuario.NombreCompleto }}</h3>
            <p>{{ usuario.Email }}</p>
          </div>

          <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="password-form">
            
            <!-- Contraseña Actual -->
            <div class="form-field">
              <label class="field-label">Contraseña Actual</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput 
                       formControlName="passwordActual"
                       type="password"
                       maxlength="50">
                <mat-error *ngIf="passwordForm.get('passwordActual')?.hasError('required')">
                  La contraseña actual es requerida
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Nueva Contraseña -->
            <div class="form-field">
              <label class="field-label">Nueva Contraseña</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput 
                       formControlName="passwordNueva"
                       type="password"
                       maxlength="50">
                <mat-hint align="start">
                  <strong>{{ passwordForm.get('passwordNueva')?.value?.length || 0 }}/50</strong>
                </mat-hint>
                <mat-error *ngIf="passwordForm.get('passwordNueva')?.hasError('required')">
                  La nueva contraseña es requerida
                </mat-error>
                <mat-error *ngIf="passwordForm.get('passwordNueva')?.hasError('minlength')">
                  La contraseña debe tener al menos 6 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Confirmar Nueva Contraseña -->
            <div class="form-field">
              <label class="field-label">Confirmar Nueva Contraseña</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput 
                       formControlName="confirmarPassword"
                       type="password"
                       maxlength="50">
                <mat-error *ngIf="passwordForm.get('confirmarPassword')?.hasError('required')">
                  Debe confirmar la nueva contraseña
                </mat-error>
                <mat-error *ngIf="passwordForm.hasError('passwordMismatch')">
                  Las contraseñas no coinciden
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Mensaje de Error -->
            <div *ngIf="error" class="error-message">
              <mat-icon>error</mat-icon>
              <span>{{ error }}</span>
            </div>

            <!-- Mensaje de Éxito -->
            <div *ngIf="success" class="success-message">
              <mat-icon>check_circle</mat-icon>
              <span>{{ success }}</span>
            </div>

            <!-- Botones -->
            <div class="form-actions">
              <button mat-raised-button type="button" (click)="onCancel()" [disabled]="loading">
                Cancelar
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!passwordForm.valid || loading">
                <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                <span *ngIf="!loading">Cambiar Contraseña</span>
                <span *ngIf="loading">Cambiando...</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 0 20px;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .form-title {
      margin: 0;
      color: #1f2937;
      font-weight: 600;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-info {
      background-color: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      border: 1px solid #e9ecef;
    }

    .user-info h3 {
      margin: 0 0 8px 0;
      color: #1f2937;
    }

    .user-info p {
      margin: 0;
      color: #6b7280;
    }

    .password-form {
      display: grid;
      gap: 20px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
    }

    .field-label {
      margin-bottom: 8px;
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #dc2626;
      background-color: #fef2f2;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #fecaca;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #16a34a;
      background-color: #f0fdf4;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #bbf7d0;
    }

    @media (max-width: 768px) {
      .form-container {
        margin: 10px;
        padding: 0 10px;
      }
      
      .form-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CambiarPasswordComponent implements OnInit {
  usuario: Usuario | null = null;
  passwordForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  private usuarioId: number = 0;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.passwordForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.usuarioId = +params['id'];
      this.loadUsuario();
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      passwordActual: ['', [Validators.required]],
      passwordNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('passwordNueva');
    const confirmPassword = form.get('confirmarPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
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

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      const formValue = this.passwordForm.value;
      const request = {
        password_actual: formValue.passwordActual,
        password_nueva: formValue.passwordNueva
      };

      this.usuarioService.cambiarPassword(this.usuarioId, request).subscribe({
        next: (result) => {
          this.success = 'Contraseña cambiada exitosamente';
          this.passwordForm.reset();
          this.loading = false;
          
          // Redirigir después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/usuarios', this.usuarioId]);
          }, 2000);
        },
        error: (err) => {
          console.error('Error al cambiar contraseña:', err);
          this.error = 'Error al cambiar la contraseña. Verifique que la contraseña actual sea correcta.';
          if (err.error?.detail) {
            this.error = err.error.detail;
          }
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/usuarios', this.usuarioId]);
  }
}