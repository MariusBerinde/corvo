const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\.\,\/\#\!\?\$\%\\\^\&\*\;\:\{\}\=\-\_\(\)\[\]\\\|'&|\`\~@\.])[^]{6,}$/;
import {Component,OnInit  } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule,Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Router } from '@angular/router';
import {LocalWriteService} from '../../services/local-write.service';
import {HomeComponent} from '../home/home.component';
import {AuthService } from '../../services/auth.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule,MatCardModule,MatFormFieldModule,MatInputModule,MatIconModule,ReactiveFormsModule],
  templateUrl: './login.component2.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  emailI='';
  pwdI='';
  nextStep:boolean=false;
  hide = true;
  errorCredentials=false;
  constructor(private lS:LocalWriteService,private _router: Router,private auth:AuthService){}
  formLogin = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    pwd: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
  });
  goBack(){
    this._router.navigate(['']);
  }
submitLogin() {
    if (this.formLogin.valid) {
        this.emailI = this.formLogin.value.email ?? '';
        this.pwdI = this.formLogin.value.pwd ?? '';
        this.nextStep = true;

        console.log("Form valido - Email:", this.emailI);

        this.checkCredenzialsDb()
            .then(isValid => {
                if (isValid) {
                    //this.lS.saveData('email', this.emailI);
                     this._router.navigate(['../home/']);
                    console.log("Login successful!");
                } else {
                    this.errorCredentials = !this.errorCredentials;
                    console.log("Credenziali non valide");
                }
            })
            .catch(error => {
                alert(`Errore durante l'autenticazione: ${error}` );
                this.errorCredentials = !this.errorCredentials;
            });

    } else {
        console.log("Il form non è valido. Errori:", this.formLogin.errors);
        this.nextStep = false;
    }
}

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }
  async checkCredenzialsDb():Promise<boolean>{

    return this.auth.checkUserPwd(this.emailI,this.pwdI);
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

