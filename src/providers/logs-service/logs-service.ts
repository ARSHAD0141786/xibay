import { Injectable } from '@angular/core';

@Injectable()
export class LogsServiceProvider {
  logs: string[] = [];

  constructor() {
    console.log('Hello LogsServiceProvider Provider');
  }

  addLog(log: string){
    this.logs.push(log);
  }

  clearLogs(){
    this.logs = [];
  }

}
