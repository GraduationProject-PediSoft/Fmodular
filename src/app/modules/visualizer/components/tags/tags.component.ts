import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { TagsService } from '../../services/tags.service';

/**
 * HTML component for dicom tags, displayed as a popup
 */
@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  loading: boolean = true;

  @ViewChild('dt') table: Table | undefined;

  tagsData: any[]=[]

  constructor(private primengConfig: PrimeNGConfig,private tagsService: TagsService) { }

  ngOnInit() {
      this.tagsService.tagsData.subscribe(data => {
        this.tagsData = Array.from(data, ([key, value]) => ({ key, value }));
        this.loading = false;
      });

      this.primengConfig.ripple = true;
  }


  getEventValue($event:any) :string {
    return $event.target.value;
  }
}
