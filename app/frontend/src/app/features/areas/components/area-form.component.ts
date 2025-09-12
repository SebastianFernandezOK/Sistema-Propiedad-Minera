import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Area, AreaCreate } from '../models/area.model';

@Component({
  selector: 'app-area-form',
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
            {{ isEdit ? 'Editar Área' : 'Crear Nueva Área' }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="areaForm" (ngSubmit)="onSubmit()" class="area-form">
            <!-- Campo Descripción -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción del Área</mat-label>
              <input matInput 
                     formControlName="Descripcion"
                     placeholder="Ingrese la descripción del área"
                     maxlength="100">
              <mat-hint align="start">
                <strong>{{ areaForm.get('Descripcion')?.value?.length || 0 }}/100</strong>
              </mat-hint>
              <mat-error *ngIf="areaForm.get('Descripcion')?.hasError('required')">
                La descripción es requerida
              </mat-error>
              <mat-error *ngIf="areaForm.get('Descripcion')?.hasError('minlength')">
                La descripción debe tener al menos 3 caracteres
              </mat-error>
              <mat-error *ngIf="areaForm.get('Descripcion')?.hasError('maxlength')">
                La descripción no puede superar los 100 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Información de auditoría (solo en edición) -->
            <div *ngIf="isEdit && initialData" class="audit-info">
              <div class="audit-field">
                <strong>ID:</strong> {{ initialData.IdArea }}
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
                      [disabled]="areaForm.invalid || loading">
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                <mat-icon *ngIf="!loading">{{ isEdit ? 'save' : 'add' }}</mat-icon>
                {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Área') }}
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
    }

    .area-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .full-width {
      width: 100%;
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
export class AreaFormComponent implements OnInit {
  @Input() isEdit = false;
  @Input() initialData: Area | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;
  
  @Output() submitForm = new EventEmitter<AreaCreate>();
  @Output() cancelForm = new EventEmitter<void>();

  areaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.areaForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.initialData) {
      this.loadInitialData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      Descripcion: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]]
    });
  }

  private loadInitialData(): void {
    if (this.initialData) {
      this.areaForm.patchValue({
        Descripcion: this.initialData.Descripcion
      });
    }
  }

  onSubmit(): void {
    if (this.areaForm.valid && !this.loading) {
      const formData: AreaCreate = {
        Descripcion: this.areaForm.get('Descripcion')?.value?.trim()
      };
      
      this.submitForm.emit(formData);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.areaForm.controls).forEach(key => {
        this.areaForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancelForm.emit();
  }

  // Métodos públicos para control externo
  resetForm(): void {
    this.areaForm.reset();
    Object.keys(this.areaForm.controls).forEach(key => {
      this.areaForm.get(key)?.setErrors(null);
    });
  }

  getFormData(): AreaCreate | null {
    if (this.areaForm.valid) {
      return {
        Descripcion: this.areaForm.get('Descripcion')?.value?.trim()
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
  get descripcionControl() {
    return this.areaForm.get('Descripcion');
  }

  get isFormValid() {
    return this.areaForm.valid;
  }

  get isFormDirty() {
    return this.areaForm.dirty;
  }
}