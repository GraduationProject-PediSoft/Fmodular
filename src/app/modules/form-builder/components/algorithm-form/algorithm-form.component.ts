import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../../services/form-control.service';
import { BaseTag } from '../../reactive-tags/base-tag';
import { TagConverterService } from '../../services/tag-converter.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

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

  @Output()
  result = new EventEmitter<any>()

  tags: BaseTag<any>[] | null = []
  
  form!: FormGroup;

  loading: boolean = false

  constructor(private tcs: FormControlService, private converter: TagConverterService, private messageM: MessageService){}

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
    this.loading = true
    this.form.disable()
    this.tcs.sendQuery(this.form,this.service, this.algorithm, this.param, this.fields)
      .pipe(finalize(()=>{
        this.loading = false
        this.form.enable()
      }))
      .subscribe({
        next: (data: ApolloQueryResult<unknown>)=> {
          this.result.emit(data)
        },
        error: (e) =>{
          this.messageM.add({
            severity: "error",
            summary: e
          })
        }
      })
  }
}
