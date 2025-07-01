export interface Log {
  id?:number,
  data:string,
  userEmail:string, //è l'email
  ip?:string,
  service?:string,
  descr:string
}
