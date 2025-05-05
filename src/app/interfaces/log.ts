export interface Log {
  id:number,
  data:string,
  user:string, //è l'email
  server?:string,
  service?:string,
  desc:string
}
