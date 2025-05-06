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
  public getAllServers():Server[]{
    return this.listaServer;
  }
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
