import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  constructor(private http: HttpClient) { 
  }

  getTiposDocumento() {
    return this.http.get(`${environment.baseUrl}/tipo-documento`);
  }

  getTipoDocumentoById(id: string) {
    return this.http.get(`${environment.baseUrl}/tipo-documento/${id}`);
  }

  createNewTipoDocumento(value: any) {
    console.log(value);

    return this.http.post(
      `${environment.baseUrl}/tipo-documento`,
      {nombre: value.nombre, estado: value.estado}
    );
  }

  updateTipoDocumento(form: any, id: string) {
    const params = new HttpParams()
    .set('nombre', form.nombre)
    .set('estado', form.estado);
    
    return this.http.put(
      `${environment.baseUrl}/tipo-documento/${id}`,
      null,
      { params }
    )
  }

  deteleTipoDocumento(id: string) {
    return this.http.delete(`${environment.baseUrl}/tipo-documento/${id}`)
  }
}
