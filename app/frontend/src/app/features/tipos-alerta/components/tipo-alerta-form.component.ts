import { Component, EventEmitter, Output, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TipoAlertaCreate, Area } from '../models/tipo-alerta.model';
import { AreaService } from '../../areas/services/area.service';

@Component({
  selector: 'app-tipo-alerta-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <mat-card class="tipo-alerta-form-card">
      <div class="form-header">
        <mat-card-title class="form-title">
          {{ modo === 'editar' ? 'Editar Tipo de Alerta' : 'Nuevo Tipo de Alerta' }}
        </mat-card-title>
        <button mat-raised-button color="primary" type="button" (click)="onCancel()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="tipo-alerta-form-grid" autocomplete="off" novalidate>
        
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

        <!-- Área -->
        <div class="form-field half-width">
          <label class="field-label">Área</label>
          <mat-form-field appearance="outline" class="half-width">
            <mat-select formControlName="IdArea">
              <mat-option [value]="null">-- Seleccione un área --</mat-option>
              <mat-option *ngFor="let area of areas" [value]="area.IdArea">
                {{ area.Descripcion }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Asunto -->
        <div class="form-field half-width">
          <label class="field-label">Asunto</label>
          <mat-form-field appearance="outline" class="half-width">
            <input matInput formControlName="Asunto" maxlength="50">
            <mat-hint>Opcional - Máximo 50 caracteres</mat-hint>
            <mat-error *ngIf="form.get('Asunto')?.hasError('maxlength')">
              El asunto no puede exceder 50 caracteres
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Mensaje -->
        <div class="form-field full-width">
          <label class="field-label">Mensaje</label>
          <mat-form-field appearance="outline" class="full-width">
            <textarea matInput formControlName="Mensaje" maxlength="5000" rows="4"></textarea>
            <mat-hint>Opcional - Máximo 5000 caracteres</mat-hint>
            <mat-error *ngIf="form.get('Mensaje')?.hasError('maxlength')">
              El mensaje no puede exceder 5000 caracteres
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Observaciones -->
        <div class="form-field full-width">
          <label class="field-label">Observaciones</label>
          <mat-form-field appearance="outline" class="full-width">
            <textarea matInput formControlName="Obs" maxlength="5000" rows="3"></textarea>
            <mat-hint>Opcional - Máximo 5000 caracteres</mat-hint>
            <mat-error *ngIf="form.get('Obs')?.hasError('maxlength')">
              Las observaciones no pueden exceder 5000 caracteres
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
    .tipo-alerta-form-card {
      max-width: 800px;
      margin: 2rem auto;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      padding: 2rem 2.5rem 1.5rem 2.5rem;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .form-title {
      color: #416759;
      font-size: 1.5rem;
      font-weight: 700;
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

    .tipo-alerta-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .half-width {
      grid-column: span 1;
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

    @media (max-width: 768px) {
      .tipo-alerta-form-grid {
        grid-template-columns: 1fr;
      }
      
      .half-width {
        grid-column: 1;
      }
    }
  `]
})
export class TipoAlertaFormComponent implements OnInit, OnChanges {
  @Output() create = new EventEmitter<TipoAlertaCreate>();
  @Output() edit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() form!: FormGroup;
  @Input() tipoAlerta: any = null;
  @Input() modo: 'crear' | 'editar' = 'crear';

  areas: Area[] = [];

  constructor(
    private fb: FormBuilder,
    private areaService: AreaService
  ) {
    // Si el form no viene por input, crear uno nuevo (modo creación)
    if (!this.form) {
      this.form = this.fb.group({
        Descripcion: ['', [Validators.required, Validators.maxLength(255)]],
        IdArea: [null], // Agregar el campo IdArea
        Asunto: ['', [Validators.maxLength(50)]],
        Mensaje: ['', [Validators.maxLength(5000)]],
        Obs: ['', [Validators.maxLength(5000)]]
      });
    }
  }

  ngOnInit(): void {
    this.cargarAreas();
    
    // Si estamos en modo edición y tenemos datos, poblar el formulario
    if (this.modo === 'editar' && this.tipoAlerta) {
      this.form.patchValue({
        Descripcion: this.tipoAlerta.Descripcion,
        IdArea: this.tipoAlerta.IdArea,
        Asunto: this.tipoAlerta.Asunto,
        Mensaje: this.tipoAlerta.Mensaje,
        Obs: this.tipoAlerta.Obs
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoAlerta'] && this.tipoAlerta && this.modo === 'editar') {
      this.form.patchValue({
        Descripcion: this.tipoAlerta.Descripcion,
        IdArea: this.tipoAlerta.IdArea,
        Asunto: this.tipoAlerta.Asunto,
        Mensaje: this.tipoAlerta.Mensaje,
        Obs: this.tipoAlerta.Obs
      });
    }
  }

  cargarAreas(): void {
    this.areaService.getAllSimple().subscribe({
      next: (areas: Area[]) => {
        this.areas = areas;
      },
      error: (error: any) => {
        console.error('Error al cargar las áreas:', error);
        this.areas = [];
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData: TipoAlertaCreate = {
        Descripcion: this.form.value.Descripcion,
        IdArea: this.form.value.IdArea,
        Asunto: this.form.value.Asunto,
        Mensaje: this.form.value.Mensaje,
        Obs: this.form.value.Obs
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