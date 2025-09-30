import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Resolucion } from '../services/resolucion.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { DateFormatDirective } from '../../../shared/directives/date-format.directive';

@Component({
  selector: 'app-resolucion-create',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, DateFormatDirective],
  template: `
    <form [@fadeInUp] [formGroup]="form" (ngSubmit)="onSubmit()" class="resolucion-form">
      <div class="row-fields">
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Número</mat-label>
          <input matInput formControlName="Numero" maxlength="50">
        </mat-form-field>
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="Titulo" maxlength="150">
        </mat-form-field>
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Estado</mat-label>
          <input matInput formControlName="Estado" maxlength="50">
        </mat-form-field>
      </div>
      <div class="row-fields">
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Fecha de Emisión</mat-label>
          <input matInput [matDatepicker]="emisionPicker" formControlName="Fecha_emision" appDateFormat>
          <mat-datepicker-toggle matSuffix [for]="emisionPicker"></mat-datepicker-toggle>
          <mat-datepicker #emisionPicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Fecha de Publicación</mat-label>
          <input matInput [matDatepicker]="publicacionPicker" formControlName="Fecha_publicacion" appDateFormat>
          <mat-datepicker-toggle matSuffix [for]="publicacionPicker"></mat-datepicker-toggle>
          <mat-datepicker #publicacionPicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Organismo Emisor</mat-label>
          <input matInput formControlName="Organismo_emisor" maxlength="100">
        </mat-form-field>
      </div>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Contenido</mat-label>
        <textarea matInput formControlName="Contenido" maxlength="5000"></textarea>
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Descripción</mat-label>
        <textarea matInput formControlName="Descripcion" maxlength="500"></textarea>
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Observaciones</mat-label>
        <textarea matInput formControlName="Observaciones" maxlength="5000"></textarea>
      </mat-form-field>
      <div class="button-row">
        <button mat-raised-button color="primary" type="submit">Crear Resolución</button>
      </div>
    </form>
  `,
  styles: [`
    .resolucion-form { display: flex; flex-direction: column; gap: 1.5rem; max-width: 700px; margin: 0 auto; position: relative; }
    .full-width { width: 100%; }
    .row-fields { display: flex; gap: 1rem; }
    .third-width { width: 33%; min-width: 180px; }
    .button-row { display: flex; justify-content: center; margin-top: 2rem; }
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
export class ResolucionCreateComponent {
  @Input() idExpediente!: number;
  @Output() create = new EventEmitter<Resolucion>();
  @Output() cancelar = new EventEmitter<void>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      Numero: [''],
      Titulo: [''],
      Fecha_emision: [null],
      Fecha_publicacion: [null],
      Organismo_emisor: [''],
      Estado: [''],
      Contenido: [''],
      Descripcion: [''],
      Observaciones: ['']
    });
  }

  onSubmit() {
    if (!this.idExpediente) return;
    const value: Resolucion = {
      IdExpediente: this.idExpediente,
      ...this.form.value,
      Fecha_emision: this.form.value.Fecha_emision ? this.formatDate(this.form.value.Fecha_emision) : undefined,
      Fecha_publicacion: this.form.value.Fecha_publicacion ? this.formatDate(this.form.value.Fecha_publicacion) : undefined
    };
    this.create.emit(value);
    this.form.reset();
  }

  private formatDate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date.substring(0, 10);
    // Angular datepicker devuelve Date
    return date.toISOString().substring(0, 10);
  }
}
