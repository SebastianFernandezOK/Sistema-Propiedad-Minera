import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TipoExpediente, TipoExpedienteCreate } from '../models/tipo-expediente.model';

@Component({
  selector: 'app-tipo-expediente-form',
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
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ isEdit ? 'edit' : 'add' }}</mat-icon>
            {{ isEdit ? 'Editar Tipo de Expediente' : 'Crear Nuevo Tipo de Expediente' }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="tipoExpedienteForm" (ngSubmit)="onSubmit()" class="tipo-expediente-form">
            <!-- Campo Nombre -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre del Tipo de Expediente</mat-label>
              <input matInput 
                     formControlName="Nombre"
                     placeholder="Ingrese el nombre del tipo de expediente"
                     maxlength="100">
              <mat-hint align="start">
                <strong>{{ tipoExpedienteForm.get('Nombre')?.value?.length || 0 }}/100</strong>
              </mat-hint>
              <mat-error *ngIf="tipoExpedienteForm.get('Nombre')?.hasError('required')">
                El nombre es requerido
              </mat-error>
              <mat-error *ngIf="tipoExpedienteForm.get('Nombre')?.hasError('minlength')">
                El nombre debe tener al menos 3 caracteres
              </mat-error>
              <mat-error *ngIf="tipoExpedienteForm.get('Nombre')?.hasError('maxlength')">
                El nombre no puede superar los 100 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Campo Descripción -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput 
                        formControlName="Descripcion"
                        placeholder="Ingrese la descripción del tipo de expediente"
                        rows="4"
                        maxlength="500">
              </textarea>
              <mat-hint align="start">
                <strong>{{ tipoExpedienteForm.get('Descripcion')?.value?.length || 0 }}/500</strong>
              </mat-hint>
              <mat-error *ngIf="tipoExpedienteForm.get('Descripcion')?.hasError('required')">
                La descripción es requerida
              </mat-error>
              <mat-error *ngIf="tipoExpedienteForm.get('Descripcion')?.hasError('minlength')">
                La descripción debe tener al menos 3 caracteres
              </mat-error>
              <mat-error *ngIf="tipoExpedienteForm.get('Descripcion')?.hasError('maxlength')">
                La descripción no puede superar los 500 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Campo Activo -->
            <div class="activo-field">
              <label class="custom-toggle">
                <input type="checkbox" formControlName="Activo" class="toggle-input">
                <span class="toggle-slider"></span>
                <span class="toggle-text">
                  {{ tipoExpedienteForm.get('Activo')?.value ? 'Activo' : 'Inactivo' }}
                </span>
              </label>
            </div>

            <!-- Información de auditoría (solo en edición) -->
            <div *ngIf="isEdit && initialData" class="audit-info">
              <div class="audit-field">
                <strong>ID:</strong> {{ initialData.IdTipoExpediente }}
              </div>
              <div class="audit-field" *ngIf="initialData.AudFecha">
                <strong>Última modificación:</strong> 
                {{ initialData.AudFecha | date:'dd/MM/yyyy HH:mm:ss' }}
              </div>
              <div class="audit-field" *ngIf="initialData.AudUsuario">
                <strong>Usuario:</strong> {{ initialData.AudUsuario }}
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="form-actions">
              <button type="button" 
                      mat-button 
                      (click)="onCancel()"
                      [disabled]="loading">
                <mat-icon>cancel</mat-icon>
                Cancelar
              </button>
              
              <button type="submit" 
                      mat-raised-button 
                      color="primary"
                      [disabled]="tipoExpedienteForm.invalid || loading">
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                <mat-icon *ngIf="!loading">{{ isEdit ? 'save' : 'add' }}</mat-icon>
                {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Tipo de Expediente') }}
              </button>
            </div>

            <!-- Mensajes de error -->
            <div *ngIf="error" class="error-message">
              <mat-icon>error</mat-icon>
              {{ error }}
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
      /* Sin font-family específico para usar la misma que expedientes */
    }

    .tipo-expediente-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .full-width {
      width: 100%;
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
      /* Sin font-family específico para usar la misma que expedientes */
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

    /* Estado activo - exactamente el mismo toggle, solo cambia posición y color */
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

    .audit-info {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 1rem;
      margin-top: 1rem;
    }

    .audit-field {
      margin-bottom: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .audit-field:last-child {
      margin-bottom: 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
      background: #ffebee;
      padding: 1rem;
      border-radius: 4px;
      border-left: 4px solid #f44336;
      margin-top: 1rem;
    }

    mat-card {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    mat-card-header {
      background: #f8f9fa;
      padding: 1.5rem;
      margin: -1rem -1rem 0 -1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #416759;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
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

    mat-form-field {
      margin-bottom: 0.5rem;
    }

    .mat-mdc-form-field-hint-wrapper {
      padding: 0;
    }

    .form-actions mat-spinner {
      margin-right: 0.5rem;
    }
  `]
})
export class TipoExpedienteFormComponent implements OnInit {
  @Input() isEdit = false;
  @Input() initialData: TipoExpediente | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;
  
  @Output() submitForm = new EventEmitter<TipoExpedienteCreate>();
  @Output() cancelForm = new EventEmitter<void>();

  tipoExpedienteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tipoExpedienteForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.initialData) {
      this.loadInitialData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      Nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      Descripcion: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(500)
      ]],
      Activo: [true, Validators.required]
    });
  }

  private loadInitialData(): void {
    if (this.initialData) {
      this.tipoExpedienteForm.patchValue({
        Nombre: this.initialData.Nombre,
        Descripcion: this.initialData.Descripcion,
        Activo: this.initialData.Activo
      });
    }
  }

  onSubmit(): void {
    if (this.tipoExpedienteForm.valid && !this.loading) {
      const formData: TipoExpedienteCreate = {
        Nombre: this.tipoExpedienteForm.get('Nombre')?.value?.trim(),
        Descripcion: this.tipoExpedienteForm.get('Descripcion')?.value?.trim(),
        Activo: this.tipoExpedienteForm.get('Activo')?.value
      };
      
      this.submitForm.emit(formData);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.tipoExpedienteForm.controls).forEach(key => {
        this.tipoExpedienteForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancelForm.emit();
  }

  // Métodos públicos para control externo
  resetForm(): void {
    this.tipoExpedienteForm.reset();
    this.tipoExpedienteForm.patchValue({ Activo: true });
    Object.keys(this.tipoExpedienteForm.controls).forEach(key => {
      this.tipoExpedienteForm.get(key)?.setErrors(null);
    });
  }

  getFormData(): TipoExpedienteCreate | null {
    if (this.tipoExpedienteForm.valid) {
      return {
        Nombre: this.tipoExpedienteForm.get('Nombre')?.value?.trim(),
        Descripcion: this.tipoExpedienteForm.get('Descripcion')?.value?.trim(),
        Activo: this.tipoExpedienteForm.get('Activo')?.value
      };
    }
    return null;
  }

  setError(error: string): void {
    this.error = error;
  }

  clearError(): void {
    this.error = null;
  }

  // Getters para facilitar el acceso en el template
  get nombreControl() {
    return this.tipoExpedienteForm.get('Nombre');
  }

  get descripcionControl() {
    return this.tipoExpedienteForm.get('Descripcion');
  }

  get activoControl() {
    return this.tipoExpedienteForm.get('Activo');
  }

  get isFormValid() {
    return this.tipoExpedienteForm.valid;
  }

  get isFormDirty() {
    return this.tipoExpedienteForm.dirty;
  }
}