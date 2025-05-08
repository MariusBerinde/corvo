export interface LynisTest{
  id:string,
  os?:string,
  desc:string
}
export interface Lynis {
  auditor:string,
  listIdSkippedTest:string[]
}
