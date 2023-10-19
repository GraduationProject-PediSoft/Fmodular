import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageDownloaderService {

  constructor(private http: HttpClient) { }

  downloadFile(fileName: string): Observable<File> {
    return this.http.get(`${environment.backendApi}/files/${fileName}`, { responseType: 'blob', observe: 'response' })
    .pipe(
      map((response: HttpResponse<Blob>) => {
        const blob = response.body as Blob;
        const file = new File([blob], fileName);
        return file;
      })
    );
    
  }
}
