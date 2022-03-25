import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TipoDocumentoService } from '../services/tipo-documento.service';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipos-documento',
  templateUrl: './tipos-documento.component.html',
  styleUrls: ['./tipos-documento.component.scss']
})
export class TiposDocumentoComponent implements OnInit {

  form: any;
  id!: string | undefined;
  tiposDocumento$!: Observable<any>;
  title: string = 'Agregar nuevo tipo de documento';

  get nombre(): AbstractControl {
    return this.form.get('nombre');
  }

  get estado(): AbstractControl {
    return this.form.get('estado');
  }

  constructor(
    private tipoDocumentoService: TipoDocumentoService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      estado: [1, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.loadTiposDocumento();
  }

  loadTiposDocumento() {
    this.tiposDocumento$ = this.tipoDocumentoService.getTiposDocumento();
  }

  saveTipoDocumento() {
    if(this.form.invalid) {
      return;
    }

    let request: any;
    let message: string = '';

    if(!this.id) {
      request = this.tipoDocumentoService.createNewTipoDocumento(this.form.value);
      message = 'El tipo de documento se guardó correctamente';
    } else {
      request = this.tipoDocumentoService.updateTipoDocumento(this.form.value, this.id);
      message = 'El tipo de documento se editó correctamente';
    }

    request
      .pipe(
        catchError(this.manageError)
      )
      .subscribe(() => {
        Swal.fire(
          '¡Listo!',
          message,
          'success'
        );

        this.resetForm();

        this.loadTiposDocumento();
      })
  }

  editTipoDocumento(id: string) {
    this.id = id;
    this.title = 'Editar tipo de documento';

    this.tipoDocumentoService.getTipoDocumentoById(this.id)
        .subscribe((res: any) => {
          if(res) {
            this.form.patchValue({
              nombre: res.nombre,
              estado: res.estado
            })
          }
        });
  }

  async deleteTipoDocumento(id: string) {
    const answer = await Swal.fire({
      title: '¡Atención!',
      text: '¿Desea eliminar el tipo de documento?',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    });

    if(answer.isConfirmed) {
      this.tipoDocumentoService.deteleTipoDocumento(id)
        .pipe(
          catchError(this.manageError)
        )
        .subscribe(() => {
          Swal.fire(
            '¡Listo!',
            'El tipo de documento se eliminó correctamente',
            'success'
          );
  
          this.loadTiposDocumento();
        })
    }
  }

  manageError(error: any) {
    Swal.fire(
      '¡Upss!',
      'Algo ha salido mal',
      'error'
    );

    return throwError(error);
  }

  resetForm() {
    this.form.reset();
    this.id = undefined;
    this.title = 'Agregar nuevo tipo de documento';
  }

  navigateBack() {
    this.router.navigate(['/home']);
  }
}
