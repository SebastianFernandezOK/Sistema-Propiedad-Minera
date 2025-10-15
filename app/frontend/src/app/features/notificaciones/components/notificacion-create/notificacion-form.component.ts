import { Component, EventEmitter, Output, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ExpedienteService } from '../../../expedientes/services/expediente.service';
import { TitularMineroService } from '../../../titulares/services/titular.service';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-notificacion-form',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="form-container">
      <mat-card class="notificacion-form-card">
        <mat-card-header class="form-header">
          <mat-card-title class="form-title">
            <mat-icon class="title-icon">notifications_active</mat-icon>
            {{ modo === 'editar' ? 'Editar Notificación' : 'Nueva Notificación' }}
          </mat-card-title>
          <mat-card-subtitle class="form-subtitle">
            {{ modo === 'editar' ? 'Modifica los datos de la notificación' : 'Completa los datos para crear una nueva notificación' }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="form-content">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="notificacion-form" autocomplete="off" novalidate>
            
            <!-- Sección: Información Principal -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>assignment</mat-icon>
                Información Principal
              </h3>
              <div class="section-fields">
                <mat-form-field appearance="outline" class="field-expediente" [class.field-disabled]="modo === 'editar'">
                  <mat-label>Expediente {{ modo === 'editar' ? '(No editable)' : '' }}</mat-label>
                  <mat-icon matPrefix [class.disabled-icon]="modo === 'editar'">{{ modo === 'editar' ? 'lock' : 'folder' }}</mat-icon>
                  <input matInput type="text" 
                         [formControl]="expedienteControl" 
                         [matAutocomplete]="autoExpediente"
                         [readonly]="modo === 'editar'"
                         [disabled]="modo === 'editar'"
                         [placeholder]="modo === 'editar' ? 'Expediente asignado (no modificable)' : 'Buscar expediente...'">
                  <mat-autocomplete #autoExpediente="matAutocomplete" (optionSelected)="onExpedienteSelected($event)">
                    <mat-option *ngFor="let expediente of expedientesFiltrados$ | async" [value]="expediente.CodigoExpediente">
                      <div class="autocomplete-option" *ngIf="modo !== 'editar'">
                        <strong>{{expediente.CodigoExpediente}}</strong>
                        <span class="option-subtitle">{{expediente.Caratula}}</span>
                      </div>
                    </mat-option>
                  </mat-autocomplete>
                  <mat-error *ngIf="expedienteControl.hasError('required') && modo !== 'editar'">
                    <mat-icon>error</mat-icon>
                    El expediente es requerido
                  </mat-error>
                  <mat-hint *ngIf="modo === 'editar'">
                    <mat-icon style="font-size: 14px; width: 14px; height: 14px;">info</mat-icon>
                    El expediente no se puede modificar una vez creada la notificación
                  </mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="field-titular">
                  <mat-label>Titular</mat-label>
                  <mat-icon matPrefix>person</mat-icon>
                  <input matInput type="text" [formControl]="titularControl" [matAutocomplete]="autoTitular" 
                         (click)="openTitularDropdown()" placeholder="Seleccionar titular...">
                  <mat-autocomplete #autoTitular="matAutocomplete" (optionSelected)="onTitularSelected($event)" [displayWith]="displayTitular">
                    <mat-option *ngFor="let titular of titularesFiltrados$ | async" [value]="titular">
                      <div class="autocomplete-option">
                        <strong>{{titular.Nombre}}</strong>
                        <span class="option-subtitle">DNI/CUIT: {{titular.DniCuit}}</span>
                      </div>
                    </mat-option>
                  </mat-autocomplete>
                  <mat-error *ngIf="titularControl.hasError('required')">
                    <mat-icon>error</mat-icon>
                    El titular es requerido
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <!-- Sección: Detalles de la Notificación -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>schedule</mat-icon>
                Detalles de la Notificación
              </h3>
              <div class="section-fields">
                <mat-form-field appearance="outline" class="field-funcionario">
                  <mat-label>Funcionario Responsable</mat-label>
                  <mat-icon matPrefix>badge</mat-icon>
                  <input matInput formControlName="funcionario" maxlength="50" 
                         placeholder="Nombre del funcionario...">
                  <mat-error *ngIf="form.get('funcionario')?.hasError('required')">
                    <mat-icon>error</mat-icon>
                    El funcionario es requerido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="field-emision">
                  <mat-label>Fecha de Emisión</mat-label>
                  <mat-icon matPrefix>calendar_today</mat-icon>
                  <input matInput [matDatepicker]="pickerEmision" formControlName="emision" 
                         placeholder="Seleccionar fecha...">
                  <mat-datepicker-toggle matSuffix [for]="pickerEmision"></mat-datepicker-toggle>
                  <mat-datepicker #pickerEmision></mat-datepicker>
                  <mat-hint>Opcional - Fecha de emisión de la notificación</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="field-plazo">
                  <mat-label>Plazo en Días</mat-label>
                  <mat-icon matPrefix>timer</mat-icon>
                  <input matInput type="number" formControlName="plazo" min="1" max="365" 
                         placeholder="Ej: 30">
                  <span matSuffix>días</span>
                  <mat-error *ngIf="form.get('plazo')?.hasError('min')">
                    <mat-icon>error</mat-icon>
                    El plazo debe ser mayor a 0
                  </mat-error>
                  <mat-hint>Opcional - Plazo límite en días</mat-hint>
                </mat-form-field>
              </div>
            </div>

          </form>
        </mat-card-content>

        <!-- Botones de Acción -->
        <mat-card-actions class="form-actions">
          <button type="submit" mat-flat-button color="primary" class="btn-primary" 
                  [disabled]="form.invalid || isSubmitting" (click)="onSubmit()">
            <mat-icon>{{ isSubmitting ? 'hourglass_empty' : (modo === 'editar' ? 'save' : 'add') }}</mat-icon>
            {{ isSubmitting ? 'Guardando...' : (modo === 'editar' ? 'Actualizar Notificación' : 'Crear Notificación') }}
          </button>
          
          <button type="button" mat-stroked-button class="btn-secondary" (click)="onCancel()">
            <mat-icon>cancel</mat-icon>
            Cancelar
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 1rem;
    }

    .notificacion-form-card {
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(65, 103, 89, 0.1);
      border: 1px solid #e8f4f0;
      overflow: hidden;
    }

    .form-header {
      background: linear-gradient(135deg, #416759 0%, #5a8a6b 100%);
      color: white;
      padding: 2rem 1.5rem 1.5rem;
      margin: 0;
      border-radius: 0;
    }

    .form-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: white;
    }

    .title-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .form-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
      margin: 0;
      font-weight: 400;
    }

    .form-content {
      padding: 2rem 1.5rem 1rem;
      background: #fafcfb;
    }

    .notificacion-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid #e8f4f0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #416759;
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #e8f4f0;
    }

    .section-title mat-icon {
      color: #5a8a6b;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .section-fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 0.5rem;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .mat-mdc-form-field {
      --mdc-outlined-text-field-container-shape: 8px;
      --mdc-outlined-text-field-focus-outline-color: #416759;
      --mdc-outlined-text-field-hover-outline-color: #5a8a6b;
      --mdc-outlined-text-field-label-text-size: 14px;
      --mdc-outlined-text-field-label-text-tracking: 0.1px;
      --mat-form-field-container-height: 56px;
      --mat-form-field-filled-with-label-container-padding-top: 24px;
      --mat-form-field-filled-with-label-container-padding-bottom: 8px;
    }

    .mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
      color: #416759;
    }

    /* Mejorar el espaciado del label para evitar solapamiento */
    .mat-mdc-form-field .mat-mdc-floating-label {
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .mat-mdc-form-field.mat-mdc-form-field-has-icon-prefix .mat-mdc-floating-label {
      left: 48px;
    }

    .mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label--float-above {
      transform: translateY(-50%) scale(0.75);
      top: -8px;
    }

    /* Asegurar que el input tenga suficiente padding */
    .mat-mdc-form-field .mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control input {
      padding: 16px 12px 16px 12px;
      height: auto;
      min-height: 24px;
    }

    .mat-mdc-form-field.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control input {
      padding-left: 48px;
    }

    /* Espaciado adicional para autocomplete */
    .mat-mdc-form-field .mat-mdc-text-field-wrapper {
      height: 56px;
      display: flex;
      align-items: center;
    }

    .autocomplete-option {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.5rem 0;
    }

    .option-subtitle {
      font-size: 0.85rem;
      color: #666;
    }

    /* Estilos para campos deshabilitados */
    .field-disabled {
      opacity: 0.7;
      pointer-events: none; /* Prevenir cualquier interacción */
    }

    .field-disabled .mdc-text-field--outlined,
    .field-disabled .mat-mdc-text-field-wrapper {
      background-color: #f5f5f5 !important;
      height: 56px;
    }

    .field-disabled input,
    .field-disabled input[readonly],
    .field-disabled input[disabled] {
      cursor: not-allowed !important;
      background-color: #f9f9f9 !important;
      color: #666 !important;
      -webkit-text-fill-color: #666 !important; /* Para Safari */
      opacity: 1 !important;
      padding: 16px 12px !important;
      height: auto !important;
      min-height: 24px !important;
    }

    .field-disabled.mat-mdc-form-field-has-icon-prefix input {
      padding-left: 48px !important;
    }

    /* Asegurar que el label flotante funcione correctamente en campos deshabilitados */
    .field-disabled .mat-mdc-floating-label {
      color: #666 !important;
    }

    .field-disabled .mat-mdc-floating-label.mdc-floating-label--float-above {
      transform: translateY(-50%) scale(0.75) !important;
      top: -8px !important;
    }

    .field-disabled .mat-mdc-form-field-input-control input {
      pointer-events: none !important;
      user-select: none !important;
    }

    .disabled-icon {
      color: #999 !important;
    }

    .field-disabled .mat-mdc-form-field-subscript-wrapper {
      color: #666;
    }

    .field-disabled mat-hint {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: #666;
      font-style: italic;
      pointer-events: auto; /* Permitir leer el hint */
    }

    /* Sobrescribir estilos de Material específicos para campos deshabilitados */
    .field-disabled .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    .field-disabled .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
    .field-disabled .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing {
      border-color: #ccc !important;
    }

    .field-disabled .mat-mdc-form-field .mdc-text-field--disabled {
      background-color: #f5f5f5 !important;
    }

    .form-actions {
      padding: 1.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e8f4f0;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      align-items: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #416759 0%, #5a8a6b 100%);
      border: none;
      border-radius: 8px;
      padding: 0.75rem 2rem;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(65, 103, 89, 0.3);
      transition: all 0.3s ease;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(65, 103, 89, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-secondary {
      border: 2px solid #416759;
      color: #416759;
      border-radius: 8px;
      padding: 0.75rem 2rem;
      font-weight: 600;
      background: white;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #416759;
      color: white;
      transform: translateY(-1px);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .form-container {
        padding: 0.5rem;
      }

      .form-header {
        padding: 1.5rem 1rem 1rem;
      }

      .form-content {
        padding: 1.5rem 1rem 1rem;
      }

      .form-section {
        padding: 1rem;
      }

      .section-fields {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-actions {
        flex-direction: column-reverse;
        align-items: stretch;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
        justify-content: center;
      }
    }

    /* Estilos específicos para datepickers y selects */
    mat-datepicker-toggle {
      color: #416759 !important;
    }

    .mat-mdc-select-value {
      padding: 16px 12px;
      min-height: 24px;
      display: flex;
      align-items: center;
    }

    .mat-mdc-select-placeholder {
      color: #666 !important;
      opacity: 0.6;
    }

    /* Mejorar la apariencia de los iconos de prefijo */
    .mat-mdc-form-field-icon-prefix {
      margin-right: 12px;
      color: #5a8a6b;
      font-size: 20px;
      display: flex;
      align-items: center;
    }

    /* Animaciones suaves */
    mat-form-field {
      transition: all 0.3s ease;
    }

    mat-form-field:focus-within {
      transform: translateY(-2px);
    }

    .form-section {
      transition: all 0.3s ease;
    }

    .form-section:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    /* Estilos para errores y mensajes */
    mat-error {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      margin-top: 4px;
      color: #d32f2f;
    }

    mat-error mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    mat-hint {
      font-size: 0.75rem;
      color: #666;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    /* Estilos para campos de ancho completo */
    .full-width {
      grid-column: 1 / -1;
    }

    .form-buttons {
      grid-column: 1 / -1;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    /* Asegurar que todos los mat-form-field tengan el ancho correcto */
    mat-form-field {
      width: 100%;
      display: block;
      position: relative;
    }
  `]
})
export class NotificacionFormComponent implements OnInit {
  @Output() create = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() notificacionData?: any;

  form!: FormGroup;
  expedienteControl = new FormControl('', [Validators.required]);
  titularControl = new FormControl('', [Validators.required]);
  expedientesFiltrados$!: Observable<any[]>;
  titularesFiltrados$!: Observable<any[]>;
  expedientes: any[] = [];
  titulares: any[] = [];
  isSubmitting = false;
  expedienteSeleccionado: any = null;
  titularSeleccionado: any = null;
  tiposExpediente: any[] = []; // Agregado para los tipos de expediente

  constructor(
    private fb: FormBuilder,
    private expedienteService: ExpedienteService,
    private titularService: TitularMineroService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadExpedientes();
    this.loadTitulares();
    this.setupExpedienteAutocomplete();
    this.setupTitularAutocomplete();
    this.loadTiposExpediente(); // Cargar tipos de expediente
    
    // Ajustar validaciones según el modo
    if (this.modo === 'editar') {
      this.expedienteControl.clearValidators(); // Remover validaciones del expediente
      this.expedienteControl.disable(); // Deshabilitar completamente el control
      this.expedienteControl.updateValueAndValidity();
    }
    
    if (this.notificacionData && this.modo === 'editar') {
      console.log('[DEBUG] Cargando datos para edición:', this.notificacionData);
      
      // Mapear los datos del backend al formulario
      this.form.patchValue({
        emision: this.notificacionData.Emision ? new Date(this.notificacionData.Emision) : null,
        plazo: this.notificacionData.Plazo,
        funcionario: this.notificacionData.Funcionario
      });
      
      // Configurar expediente
      if (this.notificacionData.CodExp) {
        this.expedienteControl.setValue(this.notificacionData.CodExp);
      }
      
      // Configurar titular - buscar el titular por ID
      if (this.notificacionData.Titular) {
        // Si Titular es un número (ID), buscar el titular en la lista
        if (typeof this.notificacionData.Titular === 'number') {
          setTimeout(() => {
            const titular = this.titulares.find(t => t.IdTitular === this.notificacionData.Titular);
            if (titular) {
              this.titularControl.setValue(titular);
              this.titularSeleccionado = titular;
            }
          }, 1000); // Esperar a que se carguen los titulares
        } else {
          // Si Titular es un string (nombre), usarlo directamente
          this.titularControl.setValue(this.notificacionData.Titular);
        }
      }
    }
  }

  private initForm() {
    this.form = this.fb.group({
      emision: [null],
      plazo: [null, Validators.min(1)],
      codExp: [null],
      titular: [null, Validators.required],
      funcionario: [null, Validators.required]
    });
  }

  private loadExpedientes() {
    this.expedienteService.getExpedientes(0, 1000).subscribe({
      next: (response) => {
        this.expedientes = response.data || [];
        console.log('[DEBUG] Expedientes cargados:', response.data);
      },
      error: (error) => {
        console.error('Error al cargar expedientes:', error);
        this.expedientes = [];
      }
    });
  }

  private loadTitulares() {
    console.log('Cargando titulares...');
    this.titularService.getAll().subscribe({
      next: (titulares) => {
        console.log('Titulares recibidos:', titulares);
        this.titulares = titulares || [];
      },
      error: (error) => {
        console.error('Error al cargar titulares:', error);
        this.titulares = [];
      }
    });
  }

  private loadTiposExpediente() {
    // Cargar los tipos de expediente desde el servicio correspondiente
    this.expedienteService.getTiposExpediente().subscribe({
      next: (tipos: { id: number; nombre: string }[]) => {
        this.tiposExpediente = tipos;
      },
      error: (error: any) => {
        console.error('Error al cargar tipos de expediente:', error);
      }
    });
  }

  private setupExpedienteAutocomplete() {
    this.expedientesFiltrados$ = this.expedienteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this.filtrarExpedientes(value || ''))
    );
  }

  private filtrarExpedientes(valor: string): any[] {
    if (!valor || !this.expedientes.length) {
      return this.expedientes.slice(0, 10); // Mostrar primeros 10
    }

    const filtro = valor.toLowerCase();
    return this.expedientes
      .filter(exp => 
        exp.CodigoExpediente?.toLowerCase().includes(filtro) ||
        exp.Caratula?.toLowerCase().includes(filtro)
      )
      .slice(0, 10);
  }

  onExpedienteSelected(event: any) {
    const codigoSeleccionado = event.option.value;
    this.expedienteSeleccionado = this.expedientes.find(exp => 
      exp.CodigoExpediente === codigoSeleccionado
    );
    // Actualizar el FormGroup principal
    this.form.patchValue({ codExp: codigoSeleccionado });
  }

  onSubmit() {
    console.log('[DEBUG] Estado del formulario:', this.form.valid, this.form.value);
    console.log('[DEBUG] Estado de isSubmitting:', this.isSubmitting);
    console.log('[DEBUG] Estado de expedienteControl:', this.expedienteControl.valid, this.expedienteControl.value);
    console.log('[DEBUG] Estado de titularControl:', this.titularControl.valid, this.titularControl.value);
    console.log('[DEBUG] Estado de funcionario:', this.form.get('funcionario')?.valid, this.form.get('funcionario')?.value);
    console.log('[DEBUG] Valor de emision:', this.form.get('emision')?.value);
    console.log('[DEBUG] Valor de plazo:', this.form.get('plazo')?.value);
    if (this.form.invalid || this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    const formData = { ...this.form.value };
    
    // Configurar datos según el modo
    if (this.modo === 'crear') {
      // Solo agregar expediente al crear (no al editar)
      formData.CodExp = this.expedienteControl.value;
    }
    
    // Titular y funcionario siempre se pueden editar
    formData.Titular = this.titularSeleccionado?.DniCuit || this.titularSeleccionado?.IdTitular;
    formData.Funcionario = this.form.get('funcionario')?.value;
    
    // Formatear fecha de emisión y mapear a nombre correcto
    if (formData.emision) {
      formData.Emision = this.formatDate(formData.emision);
    } else {
      formData.Emision = null; // Enviar null explícitamente
    }
    delete formData.emision; // Eliminar el campo en minúsculas
    
    // Mapear plazo a nombre correcto
    if (formData.plazo !== null && formData.plazo !== undefined && formData.plazo !== '') {
      formData.Plazo = parseInt(formData.plazo);
    } else {
      formData.Plazo = null; // Enviar null explícitamente
    }
    delete formData.plazo; // Eliminar el campo en minúsculas

    // En modo edición, eliminar CodExp para asegurar que no se modifique
    if (this.modo === 'editar' && formData.CodExp) {
      delete formData.CodExp;
    }

    console.log('[DEBUG] Datos finales a enviar:', formData);
    console.log('[DEBUG] Modo actual:', this.modo);
    this.create.emit(formData);
    
    setTimeout(() => {
      this.isSubmitting = false;
    }, 1000);
  }

  private setupTitularAutocomplete() {
    this.titularesFiltrados$ = this.titularControl.valueChanges.pipe(
      startWith(''),
      map(() => this.titulares) // Siempre mostrar todas las opciones
    );
  }

  private filtrarTitulares(valor: string): any[] {
    if (!valor || !this.titulares.length) {
      return this.titulares.slice(0, 10); // Mostrar primeros 10
    }

    const filtro = valor.toLowerCase();
    return this.titulares
      .filter(titular => 
        titular.DniCuit?.toLowerCase().includes(filtro) ||
        titular.Nombre?.toLowerCase().includes(filtro)
      )
      .slice(0, 10);
  }

  displayTitular(titular: any): string {
    return titular ? titular.Nombre : '';
  }

  openTitularDropdown() {
    this.titularControl.setValue('');
  }

  onTitularSelected(event: any) {
    this.titularSeleccionado = event.option.value;
    // Actualizar el FormGroup principal
    this.form.patchValue({ titular: this.titularSeleccionado?.DniCuit || this.titularSeleccionado?.Nombre });
  }

  onCancel() {
    this.cancel.emit();
  }

  private formatDate(date: Date | string): string {
    const parsedDate = new Date(date);
    // Formato ISO para compatibilidad con el backend
    return parsedDate.toISOString().split('T')[0]; // YYYY-MM-DD
  }
}