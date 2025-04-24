const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\.\,\/\#\!\?\$\%\\\^\&\*\;\:\{\}\=\-\_\(\)\[\]\\\|'&|\`\~@\.])[^]{6,}$/;
import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule,Validators} from '@angular/forms';
import {ScritturaLocaleService} from '../scrittura-locale.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  emailI='';
  pwdI='';
  nextStep:boolean=false;
  constructor(private lS:ScritturaLocaleService){}
  formLogin = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    pwd: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
  });
submitLogin(){
  if(this.formLogin.controls['pwd'].errors?.['pattern'] && this.formLogin.controls['email'].errors?.['email']) {
    this.emailI=this.formLogin.value.email??'null';
    this.pwdI=this.formLogin.value.pwd??'null';
  }


}
}

/*
  Spiegazione del pattern (PASSWORD_REGEX):

  ^: Assicura che la corrispondenza inizi dall'inizio della stringa.

  (?=.*[a-z]): Lookahead positivo che verifica se la stringa contiene almeno una lettera minuscola (a-z).
               ".*" significa "zero o più di qualsiasi carattere" prima della minuscola.

  (?=.*[A-Z]): Lookahead positivo che verifica se la stringa contiene almeno una lettera maiuscola (A-Z).
               ".*" significa "zero o più di qualsiasi carattere" prima della maiuscola.

  (?=.*\d): Lookahead positivo che verifica se la stringa contiene almeno una cifra (0-9).
            ".*" significa "zero o più di qualsiasi carattere" prima della cifra.

  (?=.*[\.\,\/\#\!\?\$\%\\\^\&\*\;\:\{\}\=\-\_\(\)\[\]\\\|'&|\`\~@\.])
            : Lookahead positivo che verifica se la stringa contiene almeno uno dei seguenti
              caratteri speciali: .,/#!?$%^&*;:{}<>=-_()[]\|'&|`~@.
              Nota: Alcuni caratteri all'interno della classe sono escaped con '\' perché hanno
              un significato speciale nelle regex.

  [^]{6,}: Corrisponde a qualsiasi carattere ([^] significa "qualsiasi carattere non incluso in un set vuoto",
           quindi di fatto qualsiasi carattere) ripetuto almeno 6 volte ({6,}). Questo assicura
           che la password abbia una lunghezza minima di 6 caratteri.

  $: Assicura che la corrispondenza arrivi fino alla fine della stringa.

  In sintesi, questo pattern verifica che una stringa (pensata per essere una password)
  contenga almeno una minuscola, una maiuscola, un numero, uno dei caratteri speciali definiti
  e abbia una lunghezza minima di 6 caratteri. L'ordine in cui questi tipi di caratteri
  appaiono nella stringa non è importante, l'importante è che siano tutti presenti almeno una volta.
*/

