import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor() { }

  private tagsDataSubject = new BehaviorSubject<Map<string, string>>(new Map<string, string>());
  tagsData = this.tagsDataSubject.asObservable();

  setTagsData(tagsData: Map<string, string>) {
    this.tagsDataSubject.next(tagsData);
  }
}
