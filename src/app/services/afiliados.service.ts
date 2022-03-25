import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AfiliadosService {

  constructor(private http: HttpClient) { 
  }

  getAfiliados() {
    return this.http.get(`${environment.baseUrl}/afiliado`);
  }

  getAfiliadoById(id: string) {
    return this.http.get(`${environment.baseUrl}/afiliado/${id}`);
  }

  createNewAfiliado(form: any) {
    return this.http.post(
      `${environment.baseUrl}/afiliado`,
      {
        nombre: form.nombre,
        apellidos: form.apellidos,
        documento: form.documento,
        direccion: form.direccion,
        telefono: form.telefono,
        mail: form.mail,
        estado: form.estado,
        tipoDocumento: {
          id: Number(form.tipoDocumento)
        }
      }
    );
  }

  updateAfiliado(form: any, id: string) {
    const params = new HttpParams()
    .set('nombre', form.nombre)
    .set('apellidos', form.apellidos)
    .set('documento', form.documento)
    .set('direccion', form.direccion)
    .set('telefono', form.telefono)
    .set('mail', form.mail)
    .set('estado', form.estado)
    .set('tipoDocumento', form.tipoDocumento);
    
    return this.http.put(
      `${environment.baseUrl}/afiliado/${id}`,
      null,
      { params }
    )
  }

  deteleAfiliado(id: string) {
    return this.http.delete(`${environment.baseUrl}/afiliado/${id}`)
  }
}
