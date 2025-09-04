import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Acta } from '../services/acta.service';
import { Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-acta-edit',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatIconModule],
  template: `
    <form [@fadeInUp] [formGroup]="form" (ngSubmit)="onSubmit()" class="acta-form">
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
          <input matInput [matDatepicker]="picker" formControlName="Fecha" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
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
        <button mat-raised-button color="primary" type="submit">Guardar Cambios</button>
      </div>
    </form>
  `,
  styles: [`
    ::ng-deep .mat-datepicker-content { background: #fff !important; }
    .acta-form { display: flex; flex-direction: column; gap: 1.5rem; max-width: 500px; margin: 0 auto; position: relative; }
    .full-width { width: 100%; }
    .row-fields { display: flex; gap: 1rem; }
    .half-width { width: 100%; }
    .button-row { display: flex; justify-content: center; margin-top: 2rem; }
    .close-btn { display: block; margin: 1.5rem auto 1.5rem auto; position: static; background: #fff; border-radius: 6px; z-index: 2; }
  `],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('400ms cubic-bezier(.35,0,.25,1)', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class ActaEditComponent {
  form: FormGroup;
  @Output() update = new EventEmitter<Acta>();
  @Output() cancelar = new EventEmitter<void>();
  @Input() acta: Acta | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['acta'] && this.acta) {
      this.form.patchValue({
        Descripcion: this.acta.Descripcion,
        Obs: this.acta.Obs,
        Fecha: this.acta.Fecha,
        IdTipoActa: this.acta.IdTipoActa,
        Lugar: this.acta.Lugar,
        IdAutoridad: this.acta.IdAutoridad
      });
    }
  }

  constructor(private fb: FormBuilder, private location: Location) {
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
    if (!this.acta) return;
    const value: Acta = {
      ...this.acta,
      ...this.form.value
    };
    this.update.emit(value);
    this.form.reset();
  }

  volver() {
    this.cancelar.emit();
  }
}
