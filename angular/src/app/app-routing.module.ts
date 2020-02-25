import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component'
import { MainComponent } from './main/main.component'
import { FanZoneComponent } from './fan-zone/fan-zone.component'
import {AdminZoneComponent } from './admin-zone/admin-zone.component'
import {ConfirmationComponent} from './auth/confirmation/confirmation.component'


const routes: Routes = [

  {path: '', component: MainComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'signup' , component: SignupComponent},
  {path: 'fan-zone' , component: FanZoneComponent},
  {path: 'admin-zone' , component: AdminZoneComponent}, 
  {path: 'confirmation/:emailToken' , component: ConfirmationComponent}, 
  {path: 'confirmation' , component: MainComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
