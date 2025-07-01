import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';

import { Server } from '../../interfaces/server';
import { ManageServerService } from '../../services/manage-server.service';
import { AuthService } from '../../services/auth.service';
import { LocalWriteService } from '../../services/local-write.service';
import { TableServicesComponent } from '../table-services/table-services.component';
import { ManageLogService } from '../../services/manage-log.service';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    TableServicesComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  userName: string = '';
  //servers: Server[] = [];
  servers = signal<Server[]> ([]);
  isLoaded = false;
  readonly panelOpenState = signal(true);

  constructor(
    private authService: AuthService,
    private router: Router,
    private serverService: ManageServerService,
    private storage: LocalWriteService,
    private log:ManageLogService
  ) {
    this.userName = this.loadUserName();
    //this.servers = this.serverService.getAllServers();
     this.serverService.getAllServersO().subscribe(
      {
        next:(tmp:Server[]) => {
          console.log("caricamento servers = ",tmp);

          //this.servers = tmp;
          this.isLoaded = true;
          this.servers.set(tmp)
        },
        error: (error)=>{
          console.log("errore servers =",error);

        }

      }
    );
  }

  loadUserName(): string {
    const email = this.storage.getData('email') ?? 'default';

    if (email === 'default') {
      return 'Altair';
    }

    const user = this.authService.getUserName(email); //TODO:check

    if (!user ) {
      return 'Default';
    }

    return user;
  }


  logout() {
    this.log.loadLocalLogs().then(
      (ris) => {
        if (ris) {
          // Solo se il caricamento è andato a buon fine, pulisci i dati locali
          this.storage.clearData();
          console.log("loading local logs to db user.component ok");
        } else {
          console.warn("loadLocalLogs returned false - logs not saved");
        }
      }
    ).catch(
        (reason) => {
          console.error(`problem with load local logs ${reason}`);
          alert(`Errore nel caricamento dei log: ${reason.message || reason}`);
          // NON fare clearData() in caso di errore - mantieni i log locali per tentare di nuovo
        }
      ).finally(() => {
        // La navigazione avviene sempre, indipendentemente dal risultato
        this.router.navigate(['']);
      });
  }
 dettagliServer(ip:string){
      this.router.navigate(['detail-server',ip]);
 }


}
