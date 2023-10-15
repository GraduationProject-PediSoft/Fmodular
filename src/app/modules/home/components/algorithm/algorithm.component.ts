import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from '../../services/algorithm.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.scss']
})
export class AlgorithmComponent implements OnInit{

  selectedAlgorithm: any

  algo: string[] = []

  constructor(private algorithmS: AlgorithmService, private messS: MessageService){}

  ngOnInit(): void {
    this.getAlgorithms()
  }

  getAlgorithmInfo(){
    this.algorithmS.getAlgorithmInfo(this.selectedAlgorithm)
      .subscribe({
        next: v => {
          
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

  getAlgorithms(){
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

  
}
