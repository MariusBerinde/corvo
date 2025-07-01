import { Injectable } from '@angular/core';
import {Server} from '../interfaces/server';
import {HttpClient,HttpHeaders,HttpErrorResponse,HttpResponse } from '@angular/common/http';
import {LocalWriteService} from './local-write.service';
import { BehaviorSubject,  Observable,map, throwError } from 'rxjs';
import {tap, retry, catchError} from 'rxjs/operators';
import { HttpStatusCode } from '@angular/common/http';
import {ManageLogService } from './manage-log.service';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageServerService {
  protected listaServer:Server[]=[
    {
      "id":0,
      "ip":"193.168.111.111",
      "state":true,
      "name":"database"
    },

    {
      "id":1,
      "ip":"193.168.111.112",
      "state":true,
      "name":"database1"
    },

    {
      "id":2,
      "ip":"193.168.111.113",
      "state":true,
      "name":"calc"
    },
    {
      "id":3,
      "ip":"193.168.111.114",
      "state":false,
      "name":"backup-calc",
      "descr":"server di backup di calcolo"
    }
  ];

  private email:string='';
  private username:string='';

  private serversSb = new BehaviorSubject<Server []>([]);
  public servers$ = this.serversSb.asObservable();
  //private readonly API_BASE = 'http://localhost:8083';
  private readonly API_BASE = environment.apiBaseUrl;
  constructor(
    private storage:LocalWriteService,
    private http:HttpClient,
    private log:ManageLogService,
  ) {

    const localEmail:string  = this.storage.getData('email')??'';

      if(localEmail.length>0)
        this.email = localEmail;

    this.username= this.storage.getData("username")??"";
  }


/**
 * Returns the complete list of available servers.
 *
 * @returns An array of `Server` objects currently stored in the system.
 */
  public getAllServers():Server[]{
    return this.listaServer;
  }

public getAllServersO(): Observable<Server []> {
  const url = `${this.API_BASE}/getAllServers`;
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'email': this.email
  });
    this.log.setLog(this.email,"get all the servers from the the database")

    return this.http.get<Server []>(url,{headers}).pipe(

      tap((rules)=>{
        this.serversSb.next(rules);
      }),
    retry(2),
      catchError(this.handleError)
    )

}
  private handleError =   (error: HttpErrorResponse): Observable<never> => {
  console.error('Errore API:', error);

  let errorMessage = 'Errore sconosciuto';
  if (error.status === 0) {
    errorMessage = 'Errore di connessione al server';
  } else if (error.status >= HttpStatusCode.BadRequest  && error.status < HttpStatusCode.InternalServerError) { //BadRequest = 400 and 500 iternal error
    errorMessage = 'Errore nella richiesta';
  } else if (error.status >= HttpStatusCode.InternalServerError) {
    errorMessage = 'Errore del server';
  }

  return throwError(() => new Error(errorMessage));
}

/**
 * Retrieves a server object based on its IP address.
 *
 * Searches the server list for a match with the provided IP.
 * If no server is found, returns a default `Server` object with empty or false values.
 *
 * @param ip - The IP address of the server to retrieve.
 * @returns The matching `Server` object if found; otherwise, a default `Server` with empty fields and `state` set to `false`.
 */
  public getServerByIp(ip:string):Server{
    const ris=this.listaServer.find(s=>s.ip===ip);
    if(ris == undefined)
      return {
      "id":-1,
      "ip":"",
      "state":false,
      "name":"",
      "descr":""
      };

    return ris;
  }

  getServerByIpO(ip:string):Server{

    const ris=this.serversSb.value.find(s=>s.ip===ip);

    if(ris == undefined)
      return {
      "id":-1,
      "ip":"",
      "state":false,
      "name":"",
      "descr":""
      };

    return ris;
  }

updateIp(ip: string, name: string | null = null, descr: string | null = null): Promise<boolean> {
  // Controlla se entrambi i parametri sono null
  if (name === null && descr === null) {
    return new Promise((resolve, reject) => {
      reject(new Error("Almeno uno tra 'name' e 'descr' deve essere specificato"));
    });
  }

  const url = `${this.API_BASE}/updateDetailServer`;

  // Costruisci l'oggetto data in base ai parametri forniti
  let data: any = {
    "username": this.username,
    "ip": ip
  };

  // Aggiungi i campi solo se non sono null
  if (name !== null) {
    data.name = name;
  }

  if (descr !== null) {
    data.descr = descr;
  }
    this.log.setLog(this.email,`update name/desc for the server with ip = ${ip}`)

  return new Promise<boolean>((resolve, reject) => {
    this.http.post(url, data, {
      observe: 'response',
      responseType: 'text' // Evita il parsing JSON se non c'è body
    }).subscribe({
      next: (response) => {
        console.log("Status in updateIp =", response.status);
        // Risolve con true se lo status è 200, false altrimenti
        resolve(response.status === HttpStatusCode.Ok);
      },
      error: (error) => {
        console.log("Error in updateIp =", error.status);
        console.log("Error message =", error.error);

        // Log dettagliato degli errori comuni
        if (error.status === 400) {
          console.warn("Bad request - parametri mancanti o non validi");
        } else if (error.status === 404) {
          console.warn("Server non trovato per l'IP specificato");
        } else if (error.status === 500) {
          console.error("Errore interno del server durante l'aggiornamento");
        }

        // Risolve con false in caso di errore (non rigetta)
        resolve(false);
      }
    });
  });
}

// VERSIONE ALTERNATIVA: Se preferisci che rigetti in caso di errore HTTP
  updateIpWithReject(ip: string, name: string | null = null, descr: string | null = null): Promise<boolean> {
    // Controlla se entrambi i parametri sono null
    if (name === null && descr === null) {
      return Promise.reject(new Error("Almeno uno tra 'name' e 'descr' deve essere specificato"));
    }

    const url = `${this.API_BASE}/updateDetailServer`;

    // Costruisci l'oggetto data in base ai parametri forniti
    let data: any = {
      "username": this.username,
      "ip": ip
    };

    if (name !== null) {
      data.name = name;
    }

    if (descr !== null) {
      data.descr = descr;
    }

    return new Promise<boolean>((resolve, reject) => {
      this.http.post(url, data, {
        observe: 'response',
        responseType: 'text'
      }).subscribe({
          next: (response) => {
            console.log("Status in updateIp =", response.status);
            if (response.status === 200) {
              resolve(true);
            } else {
              reject(new Error(`Unexpected status code: ${response.status}`));
            }
          },
          error: (error) => {
            console.log("Error in updateIp =", error.status);
            console.log("Error message =", error.error);

            // Rigetta con un errore descrittivo
            reject(new Error(`HTTP Error ${error.status}: ${error.error || 'Unknown error'}`));
          }
        });
    });
  }
}
