const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\.\,\/\#\!\?\$\%\\\^\&\*\;\:\{\}\=\-\_\(\)\[\]\\\|'&|\`\~@\.])[^]{6,}$/;

import {Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule,Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Router } from '@angular/router';
import {ScritturaLocaleService} from '../../services/scrittura-locale.service';
import {WelcomeComponent } from '../welcome/welcome.component';
@Component({
  selector: 'app-registrazione',
  imports: [MatButtonModule,MatCardModule,MatFormFieldModule,MatInputModule,MatIconModule,ReactiveFormsModule],
  templateUrl:'./registrazione.component2.html',
  styleUrl: './registrazione.component.css'
})
export class RegistrazioneComponent {
  emailI='';
  pwdI='';
  pwdRI='';
  hidePwd:boolean=true;
  hidePwdR:boolean=true;
  nextStep:boolean=false;


togglePwdVisibility(){
  console.log("togglePwdVisibility");
  this.hidePwd=!this.hidePwd;
}

togglePwdRVisibility(){
  this.hidePwdR=!this.hidePwdR;
}
constructor(private _router: Router,private lS:ScritturaLocaleService) { }
  formRegistrazione = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    pwd: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
    pwdR: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),

  });

submitRegistrazione(){
  if(this.formRegistrazione.valid){

  this.emailI=this.formRegistrazione.value.email??'null';
  this.pwdI=this.formRegistrazione.value.pwd??'null';
  this.pwdRI=this.formRegistrazione.value.pwdR??'null';
  const pwdUguali=this.pwdI!==this.pwdRI;

  this.nextStep=pwdUguali ;
  this.lS.saveData('email',this.emailI);

  console.log("valore scritto:",this.emailI);
  console.log("Provo a navigare verso welcome");
  if(this.checkRegistration())
    this._router.navigate(['']);
  }
}
checkRegistration():boolean{
  //TODO: implementare condizioni
  return true;
}

}
