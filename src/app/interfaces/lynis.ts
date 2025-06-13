export interface LynisTest{
  id:string,
  os?:string,
  desc:string
}
export interface Lynis {
  id:number,
  auditor:string,
  ip:string,
  listIdSkippedTest:string[]
}
