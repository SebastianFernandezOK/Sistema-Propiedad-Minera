import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaService } from '../services/alerta.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EstadoAlertaService } from '../services/estado-alerta.service';
import type { EstadoAlerta } from '../models/estado-alerta.model';
import { MatSelectModule } from '@angular/material/select';
import { AlertaCreate } from '../models/alerta.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { TipoAlertaService } from '../services/tipo-alerta.service';

@Component({
  selector: 'app-alerta-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './alerta-edit.component.html',
  styleUrls: ['./alerta-edit.component.css']
})
export class AlertaEditComponent {
  @Input() idTransaccion: number | null = null;
  @Input() alerta: any = null;
  @Output() update = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();
  form: FormGroup;
  tiposAlerta: any[] = [];
  estadosAlerta: EstadoAlerta[] = [];

  constructor(
    private fb: FormBuilder,
    private alertaService: AlertaService,
    private tipoAlertaService: TipoAlertaService,
    private estadoAlertaService: EstadoAlertaService
  ) {
    this.form = this.fb.group({
      IdTipoAlerta: [null, Validators.required],
      Asunto: ['', Validators.required],
      Mensaje: ['', Validators.required],
      IdEstado: [null, Validators.required],
      Estado: [''],
      Medio: [''],
      Periodicidad: [''],
      FechaInicio: [null],
      FechaFin: [null],
      Obs: ['']
    });
  }

  ngOnInit() {
    this.estadoAlertaService.getEstadosAlerta().subscribe(estados => this.estadosAlerta = estados);
    this.tipoAlertaService.getTiposAlerta().subscribe(tipos => this.tiposAlerta = tipos);
    if (this.alerta) {
      this.form.patchValue(this.alerta);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  onCancel() {
    this.cancelar.emit();
  }
}
