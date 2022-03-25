import { Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AfiliadosService } from '../services/afiliados.service';
import { TipoDocumentoService } from '../services/tipo-documento.service';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-afiliados',
  templateUrl: './afiliados.component.html',
  styleUrls: ['./afiliados.component.scss']
})
export class AfiliadosComponent implements OnInit {

  form: any;
  id!: string | undefined;
  afiliados$!: Observable<any>;
  tiposDocumento$!: Observable<any>;
  title: string = 'Agregar nuevo afiliado';

  get nombre(): AbstractControl {
    return this.form.get('nombre');
  }

  get apellidos(): AbstractControl {
    return this.form.get('apellidos');
  }

  get documento(): AbstractControl {
    return this.form.get('documento');
  }

  get direccion(): AbstractControl {
    return this.form.get('direccion');
  }

  get telefono(): AbstractControl {
    return this.form.get('telefono');
  }

  get mail(): AbstractControl {
    return this.form.get('mail');
  }

  get estado(): AbstractControl {
    return this.form.get('estado');
  }

  get tipoDocumento(): AbstractControl {
    return this.form.get('tipoDocumento');
  }

  constructor(
    private afiliadoService: AfiliadosService,
    private tipoDocumentoService: TipoDocumentoService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      mail: ['', [Validators.required]],
      estado: [1, [Validators.required]],
      tipoDocumento: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.afiliados$ = this.afiliadoService.getAfiliados();
    this.tiposDocumento$ = this.tipoDocumentoService.getTiposDocumento();
  }

  saveAfiliado() {
    if(this.form.invalid) {
      return;
    }

    let request: any;
    let message: string = '';

    if(!this.id) {
      request = this.afiliadoService.createNewAfiliado(this.form.value);
      message = 'El afiliado se guardó correctamente';
    } else {
      request = this.afiliadoService.updateAfiliado(this.form.value, this.id);
      message = 'El afiliado se editó correctamente';
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

        this.loadData();
      })
  }

  editAfiliado(id: string) {
    this.id = id;
    this.title = 'Editar información del afiliado';

    this.afiliadoService.getAfiliadoById(this.id)
        .subscribe((res: any) => {
          if(res) {
            this.form.patchValue({
              nombre: res.nombre,
              apellidos: res.apellidos,
              documento: res.documento,
              direccion: res.direccion,
              telefono: res.telefono,
              mail: res.mail,
              estado: res.estado,
              tipoDocumento: res.tipoDocumento.id
            })
          }
        });
  }

  async deleteAfiliado(id: string) {
    const answer = await Swal.fire({
      title: '¡Atención!',
      text: '¿Desea eliminar la información del afiliado?',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    });

    if(answer.isConfirmed) {
      this.afiliadoService.deteleAfiliado(id)
        .pipe(
          catchError(this.manageError)
        )
        .subscribe(() => {
          Swal.fire(
            '¡Listo!',
            'El tipo afiliado se eliminó correctamente',
            'success'
          );
  
          this.loadData();
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
    this.title = 'Agregar nuevo afiliado';
  }

  navigateBack() {
    this.router.navigate(['/home']);
  }
}
