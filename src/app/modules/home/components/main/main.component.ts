import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from '../../services/algorithm.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

  selectedAlgorithm: any

  algo: string[] = []

  constructor(private algorithmS: AlgorithmService, private messS: MessageService){}

  ngOnInit(): void {
    this.algorithmS.getAlgorithms().subscribe({
      next: (res: Iterable<string>) =>{
        this.algo = [...res]
      },
      error: () =>{
        this.messS.add({
          closable: false,
          severity: "error",
          sticky: true,
          summary: "Error al obtener algoritmos, consulta tu conexión"
        })
      }
    })
  }

  getAlgorithmInfo(){
    this.algorithmS.getAlgorithmInfo(this.selectedAlgorithm)
      .subscribe({
        next: v=> console.log(v),
        error: (e)=>{
          this.messS.add({
            severity: "error",
            summary: "Error",
            detail: e
          })
        }
      })
  }
  


  
}
