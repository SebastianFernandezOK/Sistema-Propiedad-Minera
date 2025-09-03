import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Observacion } from '../models/observacion.model';

@Component({
  selector: 'app-observacion-edit',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="observacion-form">
      <mat-form-field appearance="fill">
        <mat-label>Descripción</mat-label>
        <input matInput formControlName="Descripcion" required>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Observaciones</mat-label>
        <textarea matInput formControlName="Observaciones"></textarea>
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit">Guardar Cambios</button>
    </form>
  `,
  styles: [`
    .observacion-form { display: flex; flex-direction: column; gap: 1rem; max-width: 500px; margin: 0 auto; }
  `]
})
export class ObservacionEditComponent {
  @Input() observacion: Observacion | null = null;
  @Output() update = new EventEmitter<Observacion>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      Descripcion: ['', Validators.required],
      Observaciones: ['']
    });
  }

  ngOnChanges() {
    if (this.observacion) {
      this.form.patchValue({
        Descripcion: this.observacion.Descripcion,
        Observaciones: this.observacion.Observaciones
      });
    } else {
      this.form.reset();
    }
  }

  onSubmit() {
    if (!this.observacion) return;
    const value: Observacion = {
      ...this.observacion,
      ...this.form.value
    };
    this.update.emit(value);
    this.form.reset();
  }
}
