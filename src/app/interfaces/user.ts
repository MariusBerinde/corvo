export enum Role{Supervisor,Worker}
export interface User {
  email:string,
  username:string,
  pwd:string,//da togliere in implementazione finale
  role:Role,
}
