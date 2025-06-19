import { Component } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
//import {LoginComponent } from '../login/login.component';
//import {RegistrazioneComponent} from '../registrazione/registrazione.component';
import { Router } from '@angular/router';
import {LocalWriteService} from '../../services/local-write.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-welcome',
  imports: [MatButtonModule,MatCardModule],
  templateUrl: './welcome.component2.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  title = 'corvo';
  valore_letto='default';
  esito:boolean=false;


constructor(private _router: Router,private lS:LocalWriteService) { }

navigateToLogin(){
  this._router.navigate(['../login/']);
}
navigateToReg(){
  this._router.navigate(['../registrazione/']);
}

leggi(){
  const sup=this.lS.getData('email');
  this.valore_letto=this.lS.getData('email')??"default";
  console.log("valore letto",sup);
}

}
