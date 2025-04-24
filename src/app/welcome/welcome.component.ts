import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent } from '../login/login.component';
import {RegistrazioneComponent} from '../registrazione/registrazione.component';
import { Router } from '@angular/router';
import {ScritturaLocaleService} from '../scrittura-locale.service';
@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  title = 'corvo';
  valore_letto='default';

constructor(private _router: Router,private lS:ScritturaLocaleService) { }
navigateToLogin(){
  this._router.navigate(['../login/']);
}
navigateToReg(){
  this._router.navigate(['../registrazione/']);

}
scrivi(){
  this.lS.saveData('email','lol');
}
leggi(){
  const sup=this.lS.getData('email');
  this.valore_letto=this.lS.getData('email')??"default";
  console.log("valore letto",sup);

}

}
