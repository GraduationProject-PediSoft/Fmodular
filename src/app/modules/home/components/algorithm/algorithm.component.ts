import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from '../../services/algorithm.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { TabIndex } from './internal/menucontroller.enum';
import { IntrospectionArgsType, IntrospectionFieldsType, IntrospectionQueryResponse } from 'src/app/shared/introspection.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.scss']
})
export class AlgorithmComponent implements OnInit{

  selectedService: any
  services: string[] = []
  loadingS = false
  algorithms: IntrospectionFieldsType[] = []
  selectedAlgorithm: IntrospectionFieldsType | null = null 
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
        next: (v:IntrospectionQueryResponse) => { 
          this.algorithms = v.__schema.queryType.fields as IntrospectionFieldsType[];
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
    this.algorithmS.getServices()
    .pipe(
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
      error: (e: HttpErrorResponse) =>{
        if(e.status === 401){
          this.messS.add({
            severity: "error",
            summary: "Logueate otra vez",
            sticky: true
          })
        }else{
          this.messS.add({
            severity: "error",
            summary: "Error al obtener algoritmos, consulta tu conexión",
          })
        }
        
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
