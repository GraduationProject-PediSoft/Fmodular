import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BaseTag } from '../../result-tags/base-tag';
import { TagConverterService } from '../../services/tag-converter.service';
import { ImageDownloaderService } from '../../services/image-downloader.service';
import { ShareDataResultService } from 'src/app/shared/services/share-data-result.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-result-tag',
  templateUrl: './result-tag.component.html',
  styleUrls: ['./result-tag.component.scss']
})
export class ResultTagComponent implements OnInit{

  @Input()
  tag!: BaseTag<any>

  constructor(private downloader: ImageDownloaderService,
    private sharedDataS: ShareDataResultService,
    private messageS: MessageService
  ){}

  ngOnInit(): void {
    this.initSpecialData(this.tag.type)
  }

  //Init special data based on the type of the tag
  private initSpecialData(tagType:string){
    switch(tagType){
      case 'visualizer':{
        this.downloader.downloadFile(this.tag.value).subscribe({
          next: (v: File) =>{
            this.tag.value = v
          },
          error: (e)=>{
            this.messageS.add({
              severity: "error",
              summary: e
            })
          }
        })
        break
      }
    }
  }

  get displayLabel(): boolean{
    return !["visualizer", "visualizer-polydata", "json"].includes(this.tag.type) 
  }
  
}
