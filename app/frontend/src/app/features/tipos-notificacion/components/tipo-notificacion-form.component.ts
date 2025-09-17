import { Component, EventEmitter, Output, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TipoNotificacionCreate } from '../models/tipo-notificacion.model';

@Component({
  selector: 'app-tipo-notificacion-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatCardModule,
    MatIconModule
  ],
  template: `
    <mat-card class="tipo-notificacion-form-card">
      <div class="form-header">
        <mat-card-title class="form-title">
          {{ modo === 'editar' ? 'Editar Tipo de Notificación' : 'Nuevo Tipo de Notificación' }}
        </mat-card-title>
        <button mat-raised-button color="primary" type="button" (click)="onCancel()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="tipo-notificacion-form-grid" autocomplete="off" novalidate>
        
        <!-- Descripción -->
        <div class="form-field full-width">
          <label class="field-label">Descripción *</label>
          <mat-form-field appearance="outline" class="full-width">
            <input matInput formControlName="Descripcion" maxlength="255" required>
            <mat-error *ngIf="form.get('Descripcion')?.hasError('required')">
              La descripción es requerida
            </mat-error>
            <mat-error *ngIf="form.get('Descripcion')?.hasError('maxlength')">
              La descripción no puede exceder 255 caracteres
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Descripción Corta -->
        <div class="form-field full-width">
          <label class="field-label">Descripción Corta</label>
          <mat-form-field appearance="outline" class="full-width">
            <input matInput formControlName="DescCorta" maxlength="50">
            <mat-hint>Opcional - Máximo 50 caracteres</mat-hint>
            <mat-error *ngIf="form.get('DescCorta')?.hasError('maxlength')">
              La descripción corta no puede exceder 50 caracteres
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-actions full-width">
          <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
            {{ modo === 'editar' ? 'Guardar cambios' : 'Guardar' }}
          </button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [`
    .tipo-notificacion-form-card {
      max-width: 600px;
      margin: 2rem auto;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      padding: 2rem 2.5rem 1.5rem 2.5rem;
    }

    .form-title {
      color: #416759;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
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

    .tipo-notificacion-form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field-label {
      font-weight: 500;
      color: #333;
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
    }

    .form-actions {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
    }

    .form-actions button {
      background: #416759;
      color: white;
      padding: 12px 24px;
      font-size: 1rem;
      border-radius: 6px;
      min-width: 200px;
    }

    .form-actions button:hover:not(:disabled) {
      background: #355a4c;
    }

    .form-actions button:disabled {
      background: #ccc;
      color: #666;
    }

    mat-form-field {
      width: 100%;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      margin-top: 4px;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background: #fff !important;
    }
    
    ::ng-deep .mdc-text-field--filled .mdc-text-field__input {
      background: #fff !important;
    }
  `]
})
export class TipoNotificacionFormComponent implements OnInit, OnChanges {
  @Output() create = new EventEmitter<TipoNotificacionCreate>();
  @Output() edit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() form!: FormGroup;
  @Input() tipoNotificacion: any = null;
  @Input() modo: 'crear' | 'editar' = 'crear';

  constructor(private fb: FormBuilder) {
    // Si el form no viene por input, crear uno nuevo (modo creación)
    if (!this.form) {
      this.form = this.fb.group({
        Descripcion: ['', [Validators.required, Validators.maxLength(255)]],
        DescCorta: ['', [Validators.maxLength(50)]]
      });
    }
  }

  ngOnInit(): void {
    // Si estamos en modo edición y tenemos datos, poblar el formulario
    if (this.modo === 'editar' && this.tipoNotificacion) {
      this.form.patchValue({
        Descripcion: this.tipoNotificacion.Descripcion,
        DescCorta: this.tipoNotificacion.DescCorta
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoNotificacion'] && this.tipoNotificacion && this.modo === 'editar') {
      this.form.patchValue({
        Descripcion: this.tipoNotificacion.Descripcion,
        DescCorta: this.tipoNotificacion.DescCorta
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData: TipoNotificacionCreate = {
        Descripcion: this.form.value.Descripcion,
        DescCorta: this.form.value.DescCorta
      };

      if (this.modo === 'editar') {
        this.edit.emit(formData);
      } else {
        this.create.emit(formData);
      }
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}