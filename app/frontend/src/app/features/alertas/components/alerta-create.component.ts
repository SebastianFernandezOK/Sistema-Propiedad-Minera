import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaService } from '../services/alerta.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AlertaCreate } from '../models/alerta.model';
import { ReactiveFormsModule } from '@angular/forms';
import { TipoAlertaService } from '../services/tipo-alerta.service';
import { EstadoAlertaService } from '../services/estado-alerta.service';
import { PeriodicidadAlertaService } from '../../periodicidad-alerta/services/periodicidad-alerta.service';
import type { EstadoAlerta } from '../models/estado-alerta.model';
import type { PeriodicidadAlerta } from '../../periodicidad-alerta/models/periodicidad-alerta.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { DateFormatDirective } from '../../../shared/directives/date-format.directive';
import { SharedDatepickerModule } from '../../../shared/shared-datepicker.module';

@Component({
  selector: 'app-alerta-create',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, DateFormatDirective, SharedDatepickerModule],
  template: `
    <form [@fadeInUp] [formGroup]="form" (ngSubmit)="onSubmit()" class="alerta-form">
      <div class="row-fields">
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Tipo de Alerta</mat-label>
          <mat-select formControlName="IdTipoAlerta" required>
            <mat-option *ngFor="let tipo of tiposAlerta" [value]="tipo.IdTipoAlerta">{{ tipo.Descripcion }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Asunto</mat-label>
          <input matInput formControlName="Asunto" required maxlength="50">
        </mat-form-field>
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Mensaje</mat-label>
          <textarea matInput formControlName="Mensaje" required maxlength="5000"></textarea>
        </mat-form-field>
      </div>
      <div class="row-fields">
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Medio</mat-label>
          <mat-select formControlName="Medio">
            <mat-option *ngFor="let opcion of opcionesMedio" [value]="opcion.value" [disabled]="opcion.disabled">
              {{ opcion.label }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Periodicidad</mat-label>
          <mat-select formControlName="IdPeriodicidad" required>
            <mat-option *ngFor="let periodicidad of periodicidades" [value]="periodicidad.IdPeriodicidad">
              {{ periodicidad.Nombre }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="fill" class="third-width" *ngIf="mostrarDiasPersonalizados()">
          <mat-label>Días Personalizados</mat-label>
          <input matInput formControlName="DiasPers" type="number" placeholder="Número de días">
        </mat-form-field>
      </div>
      <div class="row-fields">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Destinatarios</mat-label>
          <textarea matInput formControlName="Destinatarios" rows="3" maxlength="5000" required></textarea>
          <mat-error *ngIf="form.get('Destinatarios')?.invalid && form.get('Destinatarios')?.touched">
            El destinatario es requerido.
          </mat-error>
        </mat-form-field>
      </div>
      <div class="row-fields">
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Fecha Inicio</mat-label>
          <input matInput [matDatepicker]="pickerInicio" formControlName="FechaInicio" appDateFormat>
          <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
          <mat-datepicker #pickerInicio></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Fecha Fin</mat-label>
          <input matInput [matDatepicker]="pickerFin" formControlName="FechaFin" appDateFormat>
          <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
          <mat-datepicker #pickerFin></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="fill" class="third-width">
          <mat-label>Observaciones</mat-label>
          <textarea matInput formControlName="Obs" maxlength="5000"></textarea>
        </mat-form-field>
      </div>
      <div class="button-row">
        <button mat-raised-button color="primary" type="submit">
          {{ editando ? 'Guardar Cambios' : 'Crear Alerta' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .alerta-form { display: flex; flex-direction: column; gap: 1.5rem; max-width: 900px; margin: 0 auto; position: relative; }
    .row-fields { display: flex; gap: 1rem; }
    .third-width { width: 33%; min-width: 180px; }
    .half-width { width: 48%; min-width: 200px; }
    .full-width { width: 100%; }
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
export class AlertaCreateComponent {
  @Input() idTransaccion: number | null = null;
  @Input() alerta: any = null;
  @Input() editando: boolean = false;
  @Input() tipoPadre: string = 'acta'; // tipo de entidad padre
  @Input() idPadre: number | null = null; // ID de la entidad padre
  @Output() create = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();
  form: FormGroup;
  tiposAlerta: any[] = [];
  estadosAlerta: EstadoAlerta[] = [];
  periodicidades: PeriodicidadAlerta[] = [];
  
  // Opciones para el menú desplegable de Medio
  opcionesMedio = [
    { value: 'Email', label: 'Email', disabled: false },
    { value: 'Whatsapp', label: 'Whatsapp (no disponible)', disabled: true }
  ];

  constructor(
    private fb: FormBuilder, 
    private alertaService: AlertaService, 
    private tipoAlertaService: TipoAlertaService, 
    private estadoAlertaService: EstadoAlertaService,
    private periodicidadAlertaService: PeriodicidadAlertaService
  ) {
    this.form = this.fb.group({
      IdTipoAlerta: [null, Validators.required],
      Asunto: ['', Validators.required],
      Mensaje: ['', Validators.required],
      IdEstado: [1], // Estado por defecto como 1 (pendiente)
      Estado: [''],
      Medio: ['Email'], // Medio por defecto como 'Email'
      IdPeriodicidad: [null, Validators.required],
      DiasPers: [null], // Campo para días personalizados
      FechaInicio: [null],
      FechaFin: [null],
      Destinatarios: ['', Validators.required],
      Obs: ['']
    });
  }

  ngOnInit() {
    this.tipoAlertaService.getTiposAlerta().subscribe(tipos => this.tiposAlerta = tipos);
    this.estadoAlertaService.getEstadosAlerta().subscribe(estados => this.estadosAlerta = estados);
    this.periodicidadAlertaService.getPeriodicidades().subscribe(periodicidades => this.periodicidades = periodicidades);
    
    // Escuchar cambios en el campo de periodicidad para validaciones dinámicas
    this.form.get('IdPeriodicidad')?.valueChanges.subscribe(value => {
      this.actualizarValidacionesDiasPers(value);
    });
    
    // Validación para el campo Destinatarios
    this.form.get('Destinatarios')?.valueChanges.subscribe(value => {
      if (!value) {
        this.form.get('Destinatarios')?.setErrors({ required: true });
      } else {
        this.form.get('Destinatarios')?.setErrors(null);
      }
    });
    
    if (this.idTransaccion) {
      this.form.addControl('IdTransaccion', this.fb.control(this.idTransaccion));
    }
    if (this.editando && this.alerta) {
      this.form.patchValue({
        Asunto: this.alerta.Asunto,
        Mensaje: this.alerta.Mensaje,
        IdEstado: this.alerta.IdEstado,
        Estado: this.alerta.Estado,
        Medio: this.alerta.Medio,
        IdPeriodicidad: this.alerta.IdPeriodicidad,
        DiasPers: this.alerta.DiasPers,
        FechaInicio: this.alerta.FechaInicio,
        FechaFin: this.alerta.FechaFin,
        Destinatarios: this.alerta.Destinatarios,
        Obs: this.alerta.Obs
      });
    }
  }

  ngOnChanges() {
    if (this.editando && this.alerta) {
      this.form.patchValue({
        Asunto: this.alerta.Asunto,
        Mensaje: this.alerta.Mensaje,
        IdEstado: this.alerta.IdEstado,
        Estado: this.alerta.Estado,
        Medio: this.alerta.Medio,
        IdPeriodicidad: this.alerta.IdPeriodicidad,
        DiasPers: this.alerta.DiasPers,
        FechaInicio: this.alerta.FechaInicio,
        FechaFin: this.alerta.FechaFin,
        Destinatarios: this.alerta.Destinatarios,
        Obs: this.alerta.Obs
      });
    } else {
      // Cuando no se está editando, mantener valores por defecto
      this.form.reset({
        IdTipoAlerta: null,
        Asunto: '',
        Mensaje: '',
        IdEstado: 1, // Estado por defecto "Pendiente"
        Estado: '',
        Medio: 'Email', // Medio por defecto "Email"
        IdPeriodicidad: null,
        DiasPers: null,
        FechaInicio: null,
        FechaFin: null,
        Destinatarios: '',
        Obs: ''
      });
    }
  }

  onSubmit() {
    console.log('=== ALERTA onSubmit ===');
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);
    console.log('Form errors:', this.form.errors);
    
    if (this.form.invalid) {
      console.log('Formulario de alerta inválido - deteniendo');
      this.form.markAllAsTouched();
      return;
    }
    
    const value: AlertaCreate = {
      ...this.form.value,
      IdTransaccion: this.idTransaccion
    };
    
    console.log('Valor a enviar:', value);
    
    if (this.editando && this.alerta && this.alerta.idAlerta) {
      console.log('Editando alerta ID:', this.alerta.idAlerta);
      this.alertaService.updateAlerta(this.alerta.idAlerta, value).subscribe({
        next: (resp) => {
          console.log('Alerta editada exitosamente:', resp);
          this.create.emit(resp);
          this.form.reset();
        },
        error: (err) => {
          console.error('[AlertaCreate] Error al editar alerta:', err);
        }
      });
    } else {
      console.log('Creando nueva alerta');
      console.log('Tipo de padre:', this.tipoPadre);
      console.log('ID de padre:', this.idPadre);
      
      // Usar el método específico según el tipo de padre
      let createObservable;
      if (this.tipoPadre === 'notificacion' && this.idPadre) {
        createObservable = this.alertaService.createAlertaForNotificacion(this.idPadre, value);
      } else {
        createObservable = this.alertaService.createAlerta(value);
      }
      
      createObservable.subscribe({
        next: (resp) => {
          console.log('Alerta creada exitosamente:', resp);
          this.create.emit(resp);
          this.form.reset();
        },
        error: (err) => {
          console.error('[AlertaCreate] Error al crear alerta:', err);
        }
      });
    }
  }

  // Función para determinar si se debe mostrar el campo de días personalizados
  mostrarDiasPersonalizados(): boolean {
    const periodicidadSeleccionada = this.form.get('IdPeriodicidad')?.value;
    return periodicidadSeleccionada === 5; // 5 es el ID para "personalizada"
  }

  // Función para actualizar las validaciones del campo DiasPers
  actualizarValidacionesDiasPers(periodicidadId: number): void {
    const diasPersControl = this.form.get('DiasPers');
    
    if (periodicidadId === 5) { // Periodicidad personalizada
      // Agregar validación requerida cuando es periodicidad personalizada
      diasPersControl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      // Remover validaciones y limpiar el valor cuando no es personalizada
      diasPersControl?.clearValidators();
      diasPersControl?.setValue(null);
    }
    
    diasPersControl?.updateValueAndValidity();
  }
}
