import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
  <p> nuovo utente </p>
<section class="listing-apply">
  <form [formGroup]="formLogin" (submit)="submitLogin()">
    <label for="email">Inserisci email:</label>
      <input id="email" type="email" formControlName="email"/>
    <label for="pwd">Inserisci password:</label>
    <input id="pwd" type="password" formControlName="pwd"/>
  <button type="submit" >Invia dati </button>
  </form>
</section >

  <section>
    valori:inseriti
    <p> email inserita : {{emailI}}</p>
    <p> pwd inserita : {{pwdI}}</p>
    <p> valore nextStep : {{nextStep}}</p>
  </section>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  emailI='';
  pwdI='';
  nextStep:boolean=false;
  formLogin = new FormGroup({
    email: new FormControl(''),
    pwd: new FormControl(''),

  });
submitLogin(){
  this.emailI=this.formLogin.value.email??'null';
  this.pwdI=this.formLogin.value.pwd??'null';
  const minLen=this.pwdI.length>=8;
  this.nextStep=minLen;

}
}
