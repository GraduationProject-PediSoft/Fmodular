import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from '../../services/algorithm.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { TabIndex } from './internal/menucontroller.enum';

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.scss']
})
export class AlgorithmComponent implements OnInit{

  selectedService: any
  services: string[] = []
  loadingS = false
  algorithms: any[] = []
  selectedAlgorithm: any 
  buildFormBool = false
  activeIndex = TabIndex.SERVICE

  result: any

  //Error handling
  showServiceError = false
  showAlgorithmError = false


  constructor(private algorithmS: AlgorithmService, private messS: MessageService){}

  ngOnInit(): void {
    this.getServices()
  }

  getServiceInfo(){
    this.algorithmS.getServiceInfo(this.selectedService)
      .subscribe({
        next: v => {
          this.algorithms = v
          if(this.algorithms.length > 0){
            this.activeIndex = TabIndex.ALGORITHM
          }else{
            this.showAlgorithmError = true
          }
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
        if(this.services.length === 0){
          this.showServiceError = true
        }
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
  
  buildForm(){
    this.buildFormBool = true
    this.activeIndex = TabIndex.PARAMS
  }

  onResultReceived(result: any){
    this.result = result
    this.activeIndex = TabIndex.RESULT
  }
}
