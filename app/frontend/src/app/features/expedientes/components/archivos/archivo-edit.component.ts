import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ArchivoService, Archivo } from '../../../archivos/services/archivo.service';

@Component({
  selector: 'app-archivo-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-card class="archivo-form">
      <mat-card-header>
        <mat-card-title>Editar Archivo</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="archivoForm" (ngSubmit)="onSubmit()">
          <!-- Información del archivo actual -->
          <div class="archivo-info">
            <p><strong>Archivo actual:</strong> {{ archivo.Nombre }}</p>
            <p><strong>Tipo:</strong> {{ archivo.Tipo }}</p>
          </div>

          <!-- Campo descripción -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <textarea matInput 
                      formControlName="descripcion"
                      rows="3"
                      placeholder="Descripción del archivo"
                      maxlength="150"></textarea>
          </mat-form-field>

          <!-- Botones de acción -->
          <div class="form-actions">
            <button mat-button type="button" (click)="onCancel()">
              Cancelar
            </button>
            <button mat-raised-button 
                    color="primary" 
                    type="submit"
                    [disabled]="archivoForm.invalid || saving">
              <mat-icon>save</mat-icon>
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .archivo-form {
      margin: 16px 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .archivo-info {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .archivo-info p {
      margin: 4px 0;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 16px;
    }
  `]
})
export class ArchivoEditComponent implements OnInit {
  @Input() archivo!: Archivo;
  @Output() archivoActualizado = new EventEmitter<Archivo>();
  @Output() cancelar = new EventEmitter<void>();

  archivoForm: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private archivoService: ArchivoService
  ) {
    this.archivoForm = this.fb.group({
      descripcion: ['']
    });
  }

  ngOnInit() {
    if (this.archivo) {
      this.archivoForm.patchValue({
        descripcion: this.archivo.Descripcion || ''
      });
    }
  }

  onSubmit() {
    if (this.archivoForm.invalid || !this.archivo) {
      return;
    }

    this.saving = true;

    const updateData = {
      Descripcion: this.archivoForm.get('descripcion')?.value
    };

    this.archivoService.updateArchivo(this.archivo.IdArchivo, updateData).subscribe({
      next: (archivoActualizado: Archivo) => {
        this.archivoActualizado.emit(archivoActualizado);
        this.saving = false;
      },
      error: (error: any) => {
        console.error('Error al actualizar archivo:', error);
        this.saving = false;
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  onCancel() {
    this.cancelar.emit();
  }
}
