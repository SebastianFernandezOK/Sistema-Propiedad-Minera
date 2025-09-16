import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ArchivoService, Archivo, FileUploadProgress } from '../../../archivos/services/archivo.service';

@Component({
  selector: 'app-archivo-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <mat-card class="archivo-form">
      <mat-card-header>
        <mat-card-title>Subir Archivo</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="archivoForm" (ngSubmit)="onSubmit()">
          <!-- Campo para seleccionar archivo -->
          <div class="file-input-container">
            <input 
              type="file" 
              #fileInput 
              (change)="onFileSelected($event)"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
              style="display: none">
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Archivo seleccionado</mat-label>
              <input matInput 
                     [value]="selectedFileName" 
                     readonly 
                     placeholder="Haga clic en el botón para seleccionar un archivo">
              <button mat-icon-button 
                      matSuffix 
                      type="button"
                      (click)="fileInput.click()">
                <mat-icon>attach_file</mat-icon>
              </button>
            </mat-form-field>
          </div>

          <!-- Campo descripción -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción (opcional)</mat-label>
            <textarea matInput 
                      formControlName="descripcion"
                      rows="3"
                      placeholder="Descripción del archivo"
                      maxlength="150"></textarea>
          </mat-form-field>

          <!-- Barra de progreso -->
          <div *ngIf="uploading" class="upload-progress">
            <p>Subiendo archivo... {{ uploadProgress }}%</p>
            <mat-progress-bar mode="determinate" [value]="uploadProgress"></mat-progress-bar>
          </div>

          <!-- Botones de acción -->
          <div class="form-actions">
            <button mat-button type="button" (click)="onCancel()" [disabled]="uploading">
              Cancelar
            </button>
            <button mat-raised-button 
                    color="primary" 
                    type="submit" 
                    [disabled]="!selectedFile || uploading">
              <mat-icon>cloud_upload</mat-icon>
              Subir Archivo
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

    .file-input-container {
      margin-bottom: 16px;
    }

    .upload-progress {
      margin: 16px 0;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 16px;
    }
  `]
})
export class ArchivoCreateComponent {
  @Input() idExpediente!: number;
  @Output() archivoCreado = new EventEmitter<Archivo>();
  @Output() cancelar = new EventEmitter<void>();

  archivoForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName = '';
  uploading = false;
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private archivoService: ArchivoService
  ) {
    this.archivoForm = this.fb.group({
      descripcion: ['']
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  onSubmit() {
    if (!this.selectedFile || !this.idExpediente) {
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;

    const descripcion = this.archivoForm.get('descripcion')?.value || '';

    this.archivoService.uploadArchivoEntidad(
      this.selectedFile,
      'expediente',
      this.idExpediente,
      descripcion
    ).subscribe({
      next: (progress: FileUploadProgress) => {
        this.uploadProgress = progress.progress;
        
        if (progress.response) {
          // Upload completado
          this.archivoCreado.emit(progress.response);
          this.resetForm();
        }
      },
      error: (error: any) => {
        console.error('Error al subir archivo:', error);
        this.uploading = false;
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  onCancel() {
    this.cancelar.emit();
  }

  private resetForm() {
    this.archivoForm.reset();
    this.selectedFile = null;
    this.selectedFileName = '';
    this.uploading = false;
    this.uploadProgress = 0;
  }
}
