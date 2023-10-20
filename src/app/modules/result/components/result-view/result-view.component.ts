import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseTag } from '../../result-tags/base-tag';
import { TagConverterService } from '../../services/tag-converter.service';

@Component({
  selector: 'app-result-view',
  templateUrl: './result-view.component.html',
  styleUrls: ['./result-view.component.scss']
})
export class ResultViewComponent implements OnChanges {
  @Input()
  res: any

  tags: BaseTag<any>[] | null = []

  constructor(private tg: TagConverterService){}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["res"]){
      this.buildResponse()
    }
  }
  ngOnInit(): void {
    this.buildResponse()
  }

  private buildResponse(){
 
    this.tags = this.tg.fromResponseToTag(this.res)
  
  }
}
