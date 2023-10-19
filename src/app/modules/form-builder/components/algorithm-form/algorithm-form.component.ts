import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../../services/form-control.service';
import { BaseTag } from '../../reactive-tags/base-tag';
import { TagConverterService } from '../../services/tag-converter.service';

@Component({
  selector: 'app-algorithm-form',
  templateUrl: './algorithm-form.component.html',
  styleUrls: ['./algorithm-form.component.scss']
})
export class AlgorithmFormComponent implements OnInit, OnChanges{

  @Input()
  fields:any[] | null = []

  @Input()
  param: any  
  
  @Input()
  service: string = ""

  @Input()
  algorithm: string = ""

  tags: BaseTag<any>[] | null = []
  
  form!: FormGroup;

  constructor(private tcs: FormControlService, private converter: TagConverterService){}

  ngOnInit(): void {
    this.buildForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['fields']){
      this.buildForm()
    }
  }

  private buildForm(){
    this.tags = this.converter.fromfieldsToTag(this.fields)
    this.form = this.tcs.toFormGroup(this.tags as BaseTag<any>[]);
  }

  sendRequest(){
    this.tcs.sendQuery(this.form,this.service, this.algorithm, this.param, this.fields)
  }
}
