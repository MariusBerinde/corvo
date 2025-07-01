import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent } from './components/login/login.component';
import {RegistrazioneComponent} from './components/registrazione/registrazione.component';
import {WelcomeComponent } from './components/welcome/welcome.component';
import {UserComponent} from './components/user/user.component';
import {DetailServerComponent} from './components/detail-server/detail-server.component';
import { LynisComponent } from './components/lynis/lynis.component';

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
  },
  {
    path:'user',
    component:UserComponent,
    title:'User'
  },
  {
    path:'detail-server/:ip',
    component: DetailServerComponent,
    data: { prerender: false }
  },
  {
    path:'lynis/:ip',
    component:LynisComponent
  }


  ];
