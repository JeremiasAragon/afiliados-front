import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AfiliadosComponent } from './afiliados/afiliados.component';
import { TiposDocumentoComponent } from './tipos-documento/tipos-documento.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'afiliados',
    component: AfiliadosComponent
  },
  {
    path: 'tipos-documento',
    component: TiposDocumentoComponent
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
