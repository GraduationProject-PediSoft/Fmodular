import { Component, Input } from '@angular/core';
import { BaseTag } from '../../result-tags/base-tag';
import { TagConverterService } from '../../services/tag-converter.service';

@Component({
  selector: 'app-result-view',
  templateUrl: './result-view.component.html',
  styleUrls: ['./result-view.component.scss']
})
export class ResultViewComponent {
  @Input()
  res: any

  tags: BaseTag<any>[] | null = []

  constructor(private tg: TagConverterService){}

  ngOnInit(): void {
    this.tags = this.tg.fromResponseToTag(this.res)
  }

  private buildResponse(){
    
  }
}
