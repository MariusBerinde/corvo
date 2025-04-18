import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-registrazione',
  imports: [ReactiveFormsModule],
  template: `
  <p> nuovo utente </p>
<section class="listing-apply">
  <form [formGroup]="formRegistrazione" (submit)="submitRegistrazione()">
    <label for="email">Inserisci email:</label>
      <input id="email" type="email" formControlName="email"/>

    <label for="pwd">Inserisci password:</label>
    <input id="pwd" type="password" formControlName="pwd"/>

    <label for="pwdR">Conferma password:</label>
    <input id="pwdR" type="password" formControlName="pwdR"/>
  <button type="submit" >Invia dati </button>
  </form>
</section >

  <section>
    valori:inseriti
    <p> email inserita : {{emailI}}</p>
    <p> pwd inserita : {{pwdI}}</p>
    <p> pwdR inserita : {{pwdRI}}</p>
    <p> valore nextStep : {{nextStep}}</p>
  </section>
  `,
  styleUrl: './registrazione.component.css'
})
export class RegistrazioneComponent {
  emailI='';
  pwdI='';
  pwdRI='';
  nextStep:boolean=false;
  formRegistrazione = new FormGroup({
    email: new FormControl(''),
    pwd: new FormControl(''),
    pwdR: new FormControl(''),

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
