import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseTag } from '../../result-tags/base-tag';
import { TagConverterService } from '../../services/tag-converter.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { IntrospectionQueryResponse, IntrospectionReturnType } from 'src/app/shared/introspection.interface';

@Component({
  selector: 'app-result-view',
  templateUrl: './result-view.component.html',
  styleUrls: ['./result-view.component.scss']
})
export class ResultViewComponent implements OnChanges {
  @Input()
  res!: ApolloQueryResult<any>

  @Input()
  resIntrospection!: IntrospectionReturnType

  @Input()
  algorithm: string = ""

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
 
    this.tags = this.tg.fromResponseToTag(this.res, this.algorithm, this.resIntrospection)
  
  }
}
