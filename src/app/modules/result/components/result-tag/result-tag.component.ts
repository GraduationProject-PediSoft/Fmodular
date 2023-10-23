import { Component, Input, OnInit } from '@angular/core';
import { BaseTag } from '../../result-tags/base-tag';
import { TagConverterService } from '../../services/tag-converter.service';
import { ImageDownloaderService } from '../../services/image-downloader.service';

@Component({
  selector: 'app-result-tag',
  templateUrl: './result-tag.component.html',
  styleUrls: ['./result-tag.component.scss']
})
export class ResultTagComponent implements OnInit{

  @Input()
  tag!: BaseTag<any>
  constructor(private downloader: ImageDownloaderService){}

  ngOnInit(): void {
    if(this.tag.type === 'visualizer'){
      this.downloader.downloadFile(this.tag.value).subscribe({
        next: (v: File) =>{
          this.tag.value = v
        },
        error: (e)=>{
          console.error(e)
        }
      })
    }
  }
  
}
