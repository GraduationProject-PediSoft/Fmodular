import { Component } from '@angular/core';
import { AlgorithmService } from '../../services/algorithm.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  selectedAlgorithm: any

  readonly test = [
    "hola",
    "dos",
    "tressss"
  ]

  file: File | null = null

  constructor(private algorithmS: AlgorithmService){}


  getAlgorithmInfo(){
    this.algorithmS.test()
  }
}
