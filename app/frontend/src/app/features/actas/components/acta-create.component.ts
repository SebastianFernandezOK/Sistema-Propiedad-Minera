import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Acta } from '../services/acta.service';

// Usar la interfaz Acta del servicio

@Component({
  selector: 'app-acta-create',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="acta-form">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Descripción*</mat-label>
        <input matInput formControlName="Descripcion" required>
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Observaciones</mat-label>
        <textarea matInput formControlName="Obs"></textarea>
      </mat-form-field>
      <div class="row-fields">
        <mat-form-field appearance="fill" class="half-width">
          <mat-label>Fecha*</mat-label>
          <input matInput formControlName="Fecha" type="date" required>
        </mat-form-field>
        <mat-form-field appearance="fill" class="half-width">
          <mat-label>Tipo de Acta*</mat-label>
          <input matInput formControlName="IdTipoActa" required>
        </mat-form-field>
      </div>
      <div class="row-fields">
        <mat-form-field appearance="fill" class="half-width">
          <mat-label>Lugar*</mat-label>
          <input matInput formControlName="Lugar" required>
        </mat-form-field>
        <mat-form-field appearance="fill" class="half-width">
          <mat-label>Autoridad*</mat-label>
          <input matInput formControlName="IdAutoridad" required>
        </mat-form-field>
      </div>
      <div class="button-row">
        <button mat-raised-button color="primary" type="submit">Crear Acta</button>
      </div>
    </form>
  `,
  styles: [`
    .acta-form { display: flex; flex-direction: column; gap: 1.5rem; max-width: 500px; margin: 0 auto; }
    .full-width { width: 100%; }
    .row-fields { display: flex; gap: 1rem; }
    .half-width { width: 100%; }
    .button-row { display: flex; justify-content: center; margin-top: 2rem; }
  `]
})
export class ActaCreateComponent {
  form: FormGroup;
  @Input() idExpediente!: number;
  @Output() create = new EventEmitter<Acta>();

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      Descripcion: ['', Validators.required],
      Obs: [''],
      Fecha: ['', Validators.required],
      IdTipoActa: ['', Validators.required],
      Lugar: ['', Validators.required],
      IdAutoridad: ['', Validators.required]
    });
  }

  onSubmit() {
    if (!this.idExpediente) return;
    const value: Acta = {
      IdExpediente: this.idExpediente,
      ...this.form.value
    };
    this.create.emit(value);
    this.form.reset();
  }
}
