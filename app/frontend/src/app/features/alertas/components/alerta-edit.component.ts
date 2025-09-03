import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaService } from '../services/alerta.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { AlertaCreate } from '../models/alerta.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { TipoAlertaService } from '../services/tipo-alerta.service';

@Component({
  selector: 'app-alerta-edit',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="alerta-form">
      <mat-form-field appearance="fill">
        <mat-label>Tipo de Alerta</mat-label>
        <mat-select formControlName="IdTipoAlerta" required>
          <mat-option *ngFor="let tipo of tiposAlerta" [value]="tipo.id">{{ tipo.nombre }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Asunto</mat-label>
        <input matInput formControlName="Asunto" required>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Mensaje</mat-label>
        <textarea matInput formControlName="Mensaje" required></textarea>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Estado</mat-label>
        <input matInput formControlName="Estado">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Medio</mat-label>
        <input matInput formControlName="Medio">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Periodicidad</mat-label>
        <input matInput formControlName="Periodicidad">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Fecha Inicio</mat-label>
        <input matInput [matDatepicker]="pickerInicio" formControlName="FechaInicio">
        <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
        <mat-datepicker #pickerInicio></mat-datepicker>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Fecha Fin</mat-label>
        <input matInput [matDatepicker]="pickerFin" formControlName="FechaFin">
        <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
        <mat-datepicker #pickerFin></mat-datepicker>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Observaciones</mat-label>
        <textarea matInput formControlName="Obs"></textarea>
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit">Guardar Cambios</button>
    </form>
  `,
  styles: [`
    .alerta-form { display: flex; flex-direction: column; gap: 1rem; max-width: 500px; margin: 0 auto; }
  `]
})
export class AlertaEditComponent {
  @Input() idTransaccion: number | null = null;
  @Input() alerta: any = null;
  @Output() update = new EventEmitter<any>();
  form: FormGroup;
  tiposAlerta: any[] = [];

  constructor(private fb: FormBuilder, private alertaService: AlertaService, private tipoAlertaService: TipoAlertaService) {
    this.form = this.fb.group({
      IdTipoAlerta: [null, Validators.required],
      Asunto: ['', Validators.required],
      Mensaje: ['', Validators.required],
      Estado: [''],
      Medio: [''],
      Periodicidad: [''],
      FechaInicio: [''],
      FechaFin: [''],
      Obs: ['']
    });
  }

  ngOnChanges() {
    this.tipoAlertaService.getTiposAlerta().subscribe(tipos => this.tiposAlerta = tipos);
    if (this.alerta) {
      this.form.patchValue({
        IdTipoAlerta: this.alerta.IdTipoAlerta,
        Asunto: this.alerta.Asunto,
        Mensaje: this.alerta.Mensaje,
        Estado: this.alerta.Estado,
        Medio: this.alerta.Medio,
        Periodicidad: this.alerta.Periodicidad,
        FechaInicio: this.alerta.FechaInicio,
        FechaFin: this.alerta.FechaFin,
        Obs: this.alerta.Obs
      });
    } else {
      this.form.reset();
    }
  }

  onSubmit() {
    const value: AlertaCreate = {
      ...this.form.value,
      IdTransaccion: this.idTransaccion
    };
    if (this.alerta && this.alerta.idAlerta) {
      this.alertaService.updateAlerta(this.alerta.idAlerta, value).subscribe({
        next: (resp) => {
          this.update.emit(resp);
          this.form.reset();
        },
        error: (err) => {
          console.error('[AlertaEdit] Error al editar alerta:', err);
        }
      });
    }
  }
}
