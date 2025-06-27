import { Injectable } from '@angular/core';
import {Server} from '../interfaces/server';
import {HttpClient,HttpHeaders,HttpErrorResponse,HttpResponse } from '@angular/common/http';
import {LocalWriteService} from './local-write.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError,map } from 'rxjs/operators';
import { HttpStatusCode } from '@angular/common/http';
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

  email:string='';
  private readonly API_BASE = 'http://localhost:8083';
  constructor(
    private storage:LocalWriteService,
    private http:HttpClient
  ) {

    const localEmail:string  = this.storage.getData('email')??'';

      if(localEmail.length>0)
        this.email = localEmail;
  }


/**
 * Returns the complete list of available servers.
 *
 * @returns An array of `Server` objects currently stored in the system.
 */
  public getAllServers():Server[]{
    return this.listaServer;
  }

public getAllServersO(): Observable<Server[]> {
  const url = `${this.API_BASE}/getAllServers`;
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'email': this.email
  });

  return this.http.get<Server[]>(url, {
    headers: headers,
    observe: 'response'
  }).pipe(
    map((response: HttpResponse<Server[]>) => response.body!),
    retry(2),
    catchError(this.handleError)
  );
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
}
