import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from '../../services/algorithm.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.scss']
})
export class AlgorithmComponent implements OnInit{

  selectedService: any

  services: string[] = []

  loadingS = false

  algorithms: string[] = []

  selectedAlgorithm: any


  constructor(private algorithmS: AlgorithmService, private messS: MessageService){}

  ngOnInit(): void {
    this.getServices()
  }

  getServiceInfo(){
    this.algorithmS.getServiceInfo(this.selectedService)
      .subscribe({
        next: v => {
          this.algorithms = v
        },
        error: (e)=>{
          this.messS.add({
            severity: "error",
            summary: "Error",
            detail: e
          })
        }
      })
  }

  getServices(){
    this.loadingS = true
    this.algorithmS.getServices().pipe(
      finalize(() =>{
        this.loadingS = false
      })
    ).subscribe({
      next: (res: Iterable<string>) =>{
        this.services = [...res]
      },
      error: () =>{
        this.messS.add({
          severity: "error",
          summary: "Error al obtener algoritmos, consulta tu conexión",
          sticky: true
        })
      }
    })
  }  
}
