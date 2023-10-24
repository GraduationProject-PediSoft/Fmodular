import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareDataResultService {

  sharedData: Map<string, any> = new Map

  addData(key: string, value: any){
    this.sharedData.set(key, value)
  }

  getData(key: string): any{
    return this.sharedData.get(key);
  }
}
