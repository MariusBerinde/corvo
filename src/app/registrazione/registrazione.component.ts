const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\.\,\/\#\!\?\$\%\\\^\&\*\;\:\{\}\=\-\_\(\)\[\]\\\|'&|\`\~@\.])[^]{6,}$/;
import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule,Validators} from '@angular/forms';
import {ScritturaLocaleService} from '../scrittura-locale.service';
import { Router } from '@angular/router';

import {WelcomeComponent } from '../welcome/welcome.component';
@Component({
  selector: 'app-registrazione',
  imports: [ReactiveFormsModule],
  templateUrl:'./registrazione.component.html',
  styleUrl: './registrazione.component.css'
})
export class RegistrazioneComponent {
  emailI='';
  pwdI='';
  pwdRI='';
  nextStep:boolean=false;


constructor(private _router: Router,private lS:ScritturaLocaleService) { }
  formRegistrazione = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    pwd: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
    pwdR: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),

  });
submitRegistrazione(){
  this.emailI=this.formRegistrazione.value.email??'null';
  this.pwdI=this.formRegistrazione.value.pwd??'null';
  this.pwdRI=this.formRegistrazione.value.pwdR??'null';
  const pwdUguali=this.pwdI!==this.pwdRI;

  this.nextStep=pwdUguali ;
  this.lS.saveData('email',this.emailI);

  console.log("valore scritto:",this.emailI);
  console.log("Provo a navigare verso welcome");
  this._router.navigate(['']);


}

}
