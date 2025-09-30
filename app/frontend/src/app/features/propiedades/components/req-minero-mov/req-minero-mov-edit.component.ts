import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ReqMineroMov, ReqMineroMovCreate, ReqMinero, ReqMineroMovService } from '../../services/req-minero-mov.service';
import { SharedDatepickerModule } from '../../../../shared/shared-datepicker.module';

@Component({
  selector: 'app-req-minero-mov-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    SharedDatepickerModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <mat-icon>edit_note</mat-icon>
          Editar Requerimiento Minero
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="reqMineroForm" (ngSubmit)="onSubmit()">
          <!-- Campo de Propiedad Minera (solo lectura) -->
          <div class="form-row horizontal-field" *ngIf="reqMineroMov?.IdPropiedadMinera">
            <label class="field-label">Propiedad Minera:</label>
            <div class="field-content">
              <mat-form-field appearance="outline" class="full-width">
                <input matInput 
                       [value]="propiedadMineraNombre || 'Cargando...'" 
                       readonly
                       placeholder="Propiedad minera asociada">
                <mat-icon matIconSuffix>business</mat-icon>
              </mat-form-field>
            </div>
          </div>

          <div class="form-row horizontal-field">
            <label class="field-label">Tipo de Requerimiento:</label>
            <div class="field-content">
              <mat-form-field appearance="outline" class="full-width">
                <mat-select formControlName="IdReqMinero" placeholder="Seleccione un tipo de requerimiento">
                  <mat-option *ngFor="let reqMinero of reqMineros" [value]="reqMinero.IdReqMinero">
                    {{ reqMinero.Tipo || 'Sin tipo' }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="reqMineroForm.get('IdReqMinero')?.hasError('required')">
                  El tipo de requerimiento es requerido
                </mat-error>
              </mat-form-field>
            </div>
          </div>

          <!-- Fila de Fecha eliminada -->

          <!-- Fila Fecha Inicio -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fecha Inicio</mat-label>
              <input matInput [matDatepicker]="pickerInicio" formControlName="FechaInicio" placeholder="Seleccione la fecha de inicio" appDateFormat>
              <mat-datepicker-toggle matIconSuffix [for]="pickerInicio"></mat-datepicker-toggle>
              <mat-datepicker #pickerInicio></mat-datepicker>
            </mat-form-field>
          </div>
          <!-- Fila Fecha Fin -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fecha Fin</mat-label>
              <input matInput [matDatepicker]="pickerFin" formControlName="FechaFin" placeholder="Seleccione la fecha de fin" appDateFormat>
              <mat-datepicker-toggle matIconSuffix [for]="pickerFin"></mat-datepicker-toggle>
              <mat-datepicker #pickerFin></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput 
                        formControlName="Descripcion"
                        placeholder="Ingrese la descripción del requerimiento"
                        rows="3"
                        maxlength="500">
              </textarea>
              <mat-hint align="end">{{reqMineroForm.get('Descripcion')?.value?.length || 0}}/500</mat-hint>
              <mat-error *ngIf="reqMineroForm.get('Descripcion')?.hasError('required')">
                La descripción es requerida
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Campo Importe - Solo aparece si se selecciona Canon (ID = 1) -->
          <div class="form-row" *ngIf="reqMineroForm.get('IdReqMinero')?.value === 1">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Importe</mat-label>
              <input matInput 
                     type="text"
                     formControlName="Importe"
                     placeholder="Ej: 1.234,56"
                     (input)="onImporteInput($event)">
              <span matTextPrefix>$ </span>
              <mat-hint align="start">
                Ingrese el importe en formato argentino (puntos para miles, coma para decimales). Ej: <b>1.234,56</b>
              </mat-hint>
              <mat-error *ngIf="reqMineroForm.get('Importe')?.hasError('min')">
                El importe debe ser mayor a 0
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-button 
                    type="button" 
                    (click)="onCancel()"
                    color="warn">
              <mat-icon>cancel</mat-icon>
              Cancelar
            </button>
            <button mat-raised-button 
                    type="submit" 
                    color="primary"
                    [disabled]="reqMineroForm.invalid || isSubmitting || !hasChanges()">
              <mat-icon>save</mat-icon>
              {{ isSubmitting ? 'Guardando...' : 'Actualizar Requerimiento' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-row {
      margin-bottom: 16px;
    }
    
    /* Diseño horizontal para campos específicos */
    .horizontal-field {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .field-label {
      font-weight: 500;
      color: rgba(0,0,0,0.7);
      font-size: 14px;
      text-align: right;
      padding-right: 8px;
    }
    
    .field-content {
      width: 100%;
    }
    
    /* Remover labels de Angular Material para campos horizontales */
    .horizontal-field .mat-mdc-form-field .mat-mdc-form-field-label {
      display: none !important;
    }
    
    /* Ajustar padding para campos horizontales */
    .horizontal-field .mat-mdc-form-field-infix {
      padding-top: 16px !important;
      padding-bottom: 16px !important;
      padding-left: 16px !important;
    }
    
    .full-width {
      width: 100%;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }
    .audit-info {
      background-color: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      margin: 16px 0;
      border-left: 4px solid #2196F3;
    }
    .audit-item {
      margin-bottom: 4px;
      font-size: 0.9em;
      color: #666;
    }
    mat-card {
      max-width: 600px;
      margin: 0 auto;
    }
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    textarea {
      resize: vertical;
      min-height: 80px;
    }
    input[readonly] {
      background-color: #f5f5f5;
      color: #666;
      cursor: not-allowed;
    }
    
    /* Estilos normales para campos regulares */
    .mat-mdc-form-field {
      width: 100% !important;
      margin-bottom: 8px !important;
    }
    
    /* Limpiar estilos anteriores */
    .mat-mdc-form-field-label {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      background: transparent !important;
      padding: 0 !important;
      z-index: auto !important;
      font-size: 16px !important;
      color: rgba(0,0,0,0.6) !important;
      transform: auto !important;
      transition: auto !important;
      white-space: normal !important;
      max-width: none !important;
      overflow: visible !important;
      text-overflow: clip !important;
    }
    
    .mat-mdc-form-field-infix {
      padding-top: 16px !important;
      padding-bottom: 16px !important;
      padding-left: 16px !important;
      min-height: auto !important;
    }
    
    .mat-mdc-form-field-outline {
      top: auto !important;
    }
    
    .mat-mdc-select-trigger,
    .mat-mdc-input-element {
      padding-top: auto !important;
      padding-bottom: auto !important;
      padding-left: auto !important;
      line-height: auto !important;
      min-height: auto !important;
    }
    
    .mat-mdc-select-value {
      line-height: auto !important;
      padding-top: auto !important;
    }
    
    .mat-mdc-form-field-subscript-wrapper {
      margin-top: auto !important;
      margin-left: auto !important;
    }
  `]
})
export class ReqMineroMovEditComponent implements OnInit, OnChanges {
  @Input() reqMineroMov: ReqMineroMov | null = null;
  @Output() update = new EventEmitter<Partial<ReqMineroMovCreate>>();
  @Output() cancelar = new EventEmitter<void>();

  reqMineroForm: FormGroup;
  reqMineros: ReqMinero[] = [];
  propiedadMineraNombre: string = '';
  isSubmitting = false;
  originalFormValue: any = {};

  constructor(private fb: FormBuilder, private reqMineroMovService: ReqMineroMovService) {
    this.reqMineroForm = this.createForm();
  }

  ngOnInit() {
    this.loadReqMineros();
    this.loadFormData();
    
    // Cargar el nombre de la propiedad minera si está disponible
    if (this.reqMineroMov?.IdPropiedadMinera) {
      this.loadPropiedadMineraNombre(this.reqMineroMov.IdPropiedadMinera);
    }
    
    // Escuchar cambios en IdReqMinero para manejar el campo Importe
    this.reqMineroForm.get('IdReqMinero')?.valueChanges.subscribe(value => {
      // Si no es Canon (ID = 1), limpiar el campo Importe
      if (value !== 1) {
        this.reqMineroForm.patchValue({ Importe: null });
      }
    });
  }

  private loadReqMineros() {
    this.reqMineroMovService.getReqMineros().subscribe({
      next: (reqMineros) => {
        this.reqMineros = reqMineros;
      },
      error: (error) => {
        console.error('Error loading req mineros:', error);
        this.reqMineros = [];
      }
    });
  }

  private loadPropiedadMineraNombre(idPropiedadMinera: number) {
    this.reqMineroMovService.getPropiedadMinera(idPropiedadMinera).subscribe({
      next: (propiedad) => {
        this.propiedadMineraNombre = propiedad.Denominacion || propiedad.Nombre || `Propiedad Minera #${idPropiedadMinera}`;
      },
      error: (error) => {
        console.error('Error loading propiedad minera:', error);
        this.propiedadMineraNombre = `Propiedad Minera #${idPropiedadMinera}`;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reqMineroMov'] && changes['reqMineroMov'].currentValue) {
      this.loadFormData();
      // Cargar el nombre de la propiedad minera cuando cambie el reqMineroMov
      if (this.reqMineroMov?.IdPropiedadMinera) {
        this.loadPropiedadMineraNombre(this.reqMineroMov.IdPropiedadMinera);
      }
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      IdReqMinero: [null, [Validators.required, Validators.min(1)]],
      FechaInicio: [null],
      FechaFin: [null],
      Descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      Importe: [null, [Validators.min(0)]]
      // AudFecha eliminado
    });
  }

  private loadFormData() {
    if (this.reqMineroMov) {
      let importe: any = this.reqMineroMov.Importe;
      if (importe !== null && importe !== undefined) {
        let str = String(importe);
        let [ent, dec] = str.split('.');
        ent = ent.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        if (dec !== undefined && dec.length > 0) {
          importe = `${ent},${dec}`;
        } else {
          importe = ent;
        }
      }
      const formData = {
        IdReqMinero: this.reqMineroMov.IdReqMinero,
        FechaInicio: this.reqMineroMov.FechaInicio ? new Date(this.reqMineroMov.FechaInicio) : null,
        FechaFin: this.reqMineroMov.FechaFin ? new Date(this.reqMineroMov.FechaFin) : null,
        Descripcion: this.reqMineroMov.Descripcion || '',
        Importe: importe
      };
      this.reqMineroForm.patchValue(formData);
      this.originalFormValue = { ...formData };
    }
  }

  hasChanges(): boolean {
    if (!this.reqMineroMov) return false;
    
    const currentValue = this.reqMineroForm.value;
    
    return JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue);
  }

  onSubmit() {
    if (this.reqMineroForm.valid && !this.isSubmitting && this.hasChanges()) {
      this.isSubmitting = true;
      const formValue = this.reqMineroForm.value;
      // Convertir Importe argentino a número para backend
      let importe = formValue.Importe;
      if (typeof importe === 'string') {
        importe = importe.replace(/\./g, '').replace(',', '.');
        importe = parseFloat(importe);
      }
      const reqMineroData: Partial<ReqMineroMovCreate> = {
        IdPropiedadMinera: this.reqMineroMov?.IdPropiedadMinera,
        IdReqMinero: formValue.IdReqMinero,
        FechaInicio: formValue.FechaInicio,
        FechaFin: formValue.FechaFin,
        Descripcion: formValue.Descripcion?.trim(),
        Importe: isNaN(importe) ? null : importe
      };
      this.update.emit(reqMineroData);
      setTimeout(() => {
        this.isSubmitting = false;
      }, 1000);
    }
  }

  // Formatea el input a formato argentino en tiempo real
  onImporteInput(event: any) {
    let value = event.target.value;
    // Permitir solo números, puntos y comas
    value = value.replace(/[^\d.,]/g, '');
    // Reemplazar múltiples puntos para miles
    let parts = value.split(',');
    let ent = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    value = parts.length > 1 ? `${ent},${parts[1]}` : ent;
    this.reqMineroForm.get('Importe')?.setValue(value, { emitEvent: false });
  }

  onCancel() {
    this.loadFormData(); // Reset to original values
    this.cancelar.emit();
  }
}
