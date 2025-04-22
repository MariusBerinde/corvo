const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\.\,\/\#\!\?\$\%\\\^\&\*\;\:\{\}\=\-\_\(\)\[\]\\\|'&|\`\~@\.])[^]{6,}$/;
import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule,Validators} from '@angular/forms';
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
  const minLen=this.pwdI.length>=8;

  this.nextStep=pwdUguali && minLen;





}

}
