import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {Router,RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule } from '@angular/material/menu'
import {MatListModule} from '@angular/material/list';
import {Server} from '../../interfaces/server';
import {GestioneServerService } from '../../services/gestione-server.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [MatListModule,RouterModule,MatMenuModule ,MatToolbarModule,MatExpansionModule,MatCardModule,MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HomeComponent {
  userName:string="";
  servers:Server[]=[];


  readonly panelOpenState = signal(true);
  constructor (private _router: Router,private mngS:GestioneServerService){
    this.userName=this.loadUserName();
    this.servers=this.mngS.getAllServers();
  }

  loadUserName():string{
    return "Altair";
  }
  //quando arrivo a questa schermata leggo il nome utente dal file e metto l'icona per avere il nome
  mostraNomeUtente(){
    alert(`Utente: ${this.userName}`);


  }
  logout(){
    alert("Lancio logout");
  }
  testArray(){
    alert(`numero di server caricati : ${this.servers.length}`);
  }
}
