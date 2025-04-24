import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent } from './login/login.component';
import {RegistrazioneComponent} from './registrazione/registrazione.component';
import {WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
  {
    path:'home',
    component:HomeComponent,
    title:'Home'
  },
  {
    path:'login',
    component:LoginComponent,
    title:'Login'
  },

  {
    path:'registrazione',
    component:RegistrazioneComponent,
    title:'Registrazione'
  },
  {
    path:'',
    component: WelcomeComponent
  }
  ];
