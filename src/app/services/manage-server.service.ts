import { Injectable } from '@angular/core';
import {Server} from '../interfaces/server';

@Injectable({
  providedIn: 'root'
})
export class ManageServerService {
  protected listaServer:Server[]=[
    {
      "id":"0",
      "ip":"193.168.111.111",
      "state":true,
      "name":"database"
    },

    {
      "id":"1",
      "ip":"193.168.111.112",
      "state":true,
      "name":"database1"
    },

    {
      "id":"2",
      "ip":"193.168.111.113",
      "state":true,
      "name":"calc"
    },
    {
      "id":"3",
      "ip":"193.168.111.114",
      "state":false,
      "name":"backup-calc",
      "descr":"server di backup di calcolo"
    }
  ];
  constructor() { }

/**
 * Returns the complete list of available servers.
 *
 * @returns An array of `Server` objects currently stored in the system.
 */
  public getAllServers():Server[]{
    return this.listaServer;
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
      "id":"",
      "ip":"",
      "state":false,
      "name":"",
      "descr":""
      };

    return ris;
  }
}
