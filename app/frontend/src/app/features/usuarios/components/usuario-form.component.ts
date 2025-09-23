import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Usuario, UsuarioCreate } from '../models/usuario.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <mat-card-title class="form-title">
            {{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </mat-card-title>
          <button mat-raised-button color="primary" type="button" (click)="onCancel()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
            Volver
          </button>
        </div>

        <mat-card-content>
          <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()" class="usuario-form">
            
            <!-- Campo Nombre Completo -->
            <div class="form-field">
              <label class="field-label">Nombre Completo</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput 
                       formControlName="NombreCompleto"
                       maxlength="60">
                <mat-hint align="start">
                  <strong>{{ usuarioForm.get('NombreCompleto')?.value?.length || 0 }}/60</strong>
                </mat-hint>
                <mat-error *ngIf="usuarioForm.get('NombreCompleto')?.hasError('required')">
                  El nombre completo es requerido
                </mat-error>
                <mat-error *ngIf="usuarioForm.get('NombreCompleto')?.hasError('minlength')">
                  El nombre completo debe tener al menos 3 caracteres
                </mat-error>
                <mat-error *ngIf="usuarioForm.get('NombreCompleto')?.hasError('maxlength')">
                  El nombre completo no puede superar los 60 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Campo Nombre de Usuario -->
            <div class="form-field">
              <label class="field-label">Nombre de Usuario</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput 
                       formControlName="NombreUsuario"
                       maxlength="30">
                <mat-hint align="start">
                  <strong>{{ usuarioForm.get('NombreUsuario')?.value?.length || 0 }}/30</strong>
                </mat-hint>
                <mat-error *ngIf="usuarioForm.get('NombreUsuario')?.hasError('required')">
                  El nombre de usuario es requerido
                </mat-error>
                <mat-error *ngIf="usuarioForm.get('NombreUsuario')?.hasError('minlength')">
                  El nombre de usuario debe tener al menos 3 caracteres
                </mat-error>
                <mat-error *ngIf="usuarioForm.get('NombreUsuario')?.hasError('maxlength')">
                  El nombre de usuario no puede superar los 30 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Campo Email -->
            <div class="form-field">
              <label class="field-label">Email</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput 
                       formControlName="Email"
                       type="email"
                       maxlength="100">
                <mat-hint align="start">
                  <strong>{{ usuarioForm.get('Email')?.value?.length || 0 }}/100</strong>
                </mat-hint>
                <mat-error *ngIf="usuarioForm.get('Email')?.hasError('required')">
                  El email es requerido
                </mat-error>
                <mat-error *ngIf="usuarioForm.get('Email')?.hasError('email')">
                  Ingrese un email válido
                </mat-error>
                <mat-error *ngIf="usuarioForm.get('Email')?.hasError('maxlength')">
                  El email no puede superar los 100 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Campo Password (solo para creación) -->
            <div class="form-field" *ngIf="!isEdit">
              <label class="field-label">Contraseña</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput 
                       formControlName="Password"
                       type="password"
                       maxlength="50">
                <mat-hint align="start">
                  <strong>{{ usuarioForm.get('Password')?.value?.length || 0 }}/50</strong>
                </mat-hint>
                <mat-error *ngIf="usuarioForm.get('Password')?.hasError('required')">
                  La contraseña es requerida
                </mat-error>
                <mat-error *ngIf="usuarioForm.get('Password')?.hasError('minlength')">
                  La contraseña debe tener al menos 6 caracteres
                </mat-error>
                <mat-error *ngIf="usuarioForm.get('Password')?.hasError('maxlength')">
                  La contraseña no puede superar los 50 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Campo Rol -->
            <div class="form-field">
              <label class="field-label">Rol</label>
              <mat-form-field appearance="outline" class="full-width">
                <mat-select formControlName="Rol">
                  <mat-option value="Administrador">Administrador</mat-option>
                  <mat-option value="Usuario">Usuario</mat-option>
                  <mat-option value="Consultor">Consultor</mat-option>
                  <mat-option value="Supervisor">Supervisor</mat-option>
                </mat-select>
                <mat-error *ngIf="usuarioForm.get('Rol')?.hasError('required')">
                  El rol es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Campo Teléfono -->
            <div class="form-field">
              <label class="field-label">Teléfono (Opcional)</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput 
                       formControlName="Telefono"
                       maxlength="25">
                <mat-hint align="start">
                  <strong>{{ usuarioForm.get('Telefono')?.value?.length || 0 }}/25</strong>
                </mat-hint>
                <mat-error *ngIf="usuarioForm.get('Telefono')?.hasError('maxlength')">
                  El teléfono no puede superar los 25 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Campo Observación -->
            <div class="form-field">
              <label class="field-label">Observación (Opcional)</label>
              <mat-form-field appearance="outline" class="full-width">
                <textarea matInput 
                          formControlName="Observacion"
                          rows="3"
                          maxlength="200">
                </textarea>
                <mat-hint align="start">
                  <strong>{{ usuarioForm.get('Observacion')?.value?.length || 0 }}/200</strong>
                </mat-hint>
                <mat-error *ngIf="usuarioForm.get('Observacion')?.hasError('maxlength')">
                  La observación no puede superar los 200 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Campo Descripción -->
            <div class="form-field">
              <label class="field-label">Descripción (Opcional)</label>
              <mat-form-field appearance="outline" class="full-width">
                <textarea matInput 
                          formControlName="Descripcion"
                          rows="3"
                          maxlength="200">
                </textarea>
                <mat-hint align="start">
                  <strong>{{ usuarioForm.get('Descripcion')?.value?.length || 0 }}/200</strong>
                </mat-hint>
                <mat-error *ngIf="usuarioForm.get('Descripcion')?.hasError('maxlength')">
                  La descripción no puede superar los 200 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Campo Activo -->
            <div class="activo-field">
              <label class="custom-toggle">
                <input type="checkbox" formControlName="Activo" class="toggle-input">
                <span class="toggle-slider"></span>
                <span class="toggle-text">
                  {{ usuarioForm.get('Activo')?.value ? 'Activo' : 'Inactivo' }}
                </span>
              </label>
            </div>

            <!-- Mensaje de Error -->
            <div *ngIf="error" class="error-message">
              <mat-icon>error</mat-icon>
              <span>{{ error }}</span>
            </div>

            <!-- Botones -->
            <div class="form-actions">
              <button mat-raised-button type="button" (click)="onCancel()" [disabled]="loading">
                Cancelar
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!usuarioForm.valid || loading">
                <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                <span *ngIf="!loading">{{ isEdit ? 'Actualizar' : 'Crear' }}</span>
                <span *ngIf="loading">{{ isEdit ? 'Actualizando...' : 'Creando...' }}</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8f9fa;
      padding: 1.5rem;
      margin: -1.5rem -1.5rem 1.5rem -1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .form-title {
      color: #416759;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #416759;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.95rem;
    }

    .back-button:hover {
      background: #355a4c;
    }

    .usuario-form {
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
      color: #333;
      font-size: 0.95rem;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      background: #ffebee;
      padding: 12px;
      border-radius: 4px;
      border-left: 4px solid #f44336;
      margin-top: 1rem;
    }

    mat-card {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    mat-card-content {
      padding: 1.5rem;
    }

    button[color="primary"] {
      background: #416759;
      color: white;
    }

    button[color="primary"]:hover:not([disabled]) {
      background: #355a4c;
    }

    button[color="primary"]:disabled {
      background: #ccc;
    }

    .activo-field {
      display: flex;
      align-items: center;
      padding: 1.2rem;
      background: #f8f9fa;
      border-radius: 8px;
      border: 2px solid #e9ecef;
      transition: border-color 0.3s ease;
    }

    .activo-field:hover {
      border-color: #416759;
    }

    /* Toggle personalizado */
    .custom-toggle {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
    }

    .toggle-input {
      display: none;
    }

    .toggle-slider {
      position: relative;
      width: 50px;
      height: 22px;
      background-color: #ddd;
      border: 2px solid #333;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .toggle-slider::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      width: 16px;
      height: 16px;
      background-color: white;
      border: 2px solid #333;
      border-radius: 50%;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    /* Estado activo */
    .toggle-input:checked + .toggle-slider {
      background-color: #4caf50;
      border: 2px solid #333;
    }

    .toggle-input:checked + .toggle-slider::before {
      transform: translateX(26px);
      background-color: white;
      border: 2px solid #333;
    }

    .toggle-text {
      color: #333;
      user-select: none;
    }

    .form-actions mat-spinner {
      margin-right: 0.5rem;
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
export class UsuarioFormComponent implements OnInit, OnChanges {
  @Input() usuario: Usuario | null = null;
  @Input() isEdit: boolean = false;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Output() submitForm = new EventEmitter<UsuarioCreate>();
  @Output() cancelForm = new EventEmitter<void>();

  usuarioForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    // Inicialización diferida hasta ngOnInit
  }

  ngOnInit(): void {
    this.usuarioForm = this.createForm();
    this.initializeForm();
  }

  ngOnChanges(): void {
    if (this.usuario && this.isEdit) {
      // Recrear el formulario si es necesario
      if (!this.usuarioForm) {
        this.usuarioForm = this.createForm();
      }
      this.populateForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      NombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      NombreUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      Password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      Rol: ['', [Validators.required]],
      Telefono: ['', [Validators.maxLength(25)]],
      Observacion: ['', [Validators.maxLength(200)]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Activo: [false]
    });
  }

  private initializeForm(): void {
    if (!this.isEdit) {
      this.usuarioForm.patchValue({
        Activo: true
      });
    }
  }

  private populateForm(): void {
    if (this.usuario) {
      this.usuarioForm.patchValue({
        NombreCompleto: this.usuario.NombreCompleto,
        NombreUsuario: this.usuario.NombreUsuario,
        Email: this.usuario.Email,
        Rol: this.usuario.Rol,
        Telefono: this.usuario.Telefono || '',
        Observacion: this.usuario.Observacion || '',
        Descripcion: this.usuario.Descripcion || '',
        Activo: this.usuario.Activo
      });
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.value;
      const usuarioData: UsuarioCreate = {
        NombreCompleto: formValue.NombreCompleto,
        NombreUsuario: formValue.NombreUsuario,
        Email: formValue.Email,
        Password: formValue.Password || '',
        Rol: formValue.Rol,
        Activo: formValue.Activo,
        Telefono: formValue.Telefono || null,
        Observacion: formValue.Observacion || null,
        Descripcion: formValue.Descripcion || null
      };

      // Solo agregar FechaCreacion si no estamos editando
      if (!this.isEdit) {
        usuarioData.FechaCreacion = new Date().toISOString().split('T')[0];
      }

      this.submitForm.emit(usuarioData);
    }
  }

  onCancel(): void {
    this.cancelForm.emit();
  }
}