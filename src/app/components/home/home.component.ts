import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

import { Server } from '../../interfaces/server';
import { GestioneServerService } from '../../services/gestione-server.service';
import { AuthService } from '../../services/auth.service';
import { ScritturaLocaleService } from '../../services/scrittura-locale.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  userName: string = '';
  servers: Server[] = [];
  readonly panelOpenState = signal(true);

  constructor(
    private authService: AuthService,
    private router: Router,
    private serverService: GestioneServerService,
    private storage: ScritturaLocaleService
  ) {
    this.userName = this.loadUserName();
    this.servers = this.serverService.getAllServers();
  }

  loadUserName(): string {
    const email = this.storage.getData('email') ?? 'default';

    if (email === 'default') {
      return 'Altair';
    }

    const user = this.authService.getUserName(email);

    if (!user ) {
      return 'Default';
    }

    return user;
  }


  logout() {
      this.router.navigate(['']);
  }

}
