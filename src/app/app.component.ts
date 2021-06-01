import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataBindingDirective, GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { PopupService, PopupRef } from "@progress/kendo-angular-popup";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { AppService } from './app.service';
import { Puesto } from './model-puestos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public icSearch = faSearch;
  public icFileExp = faFileExport;
  public icShowCol = faGripLinesVertical;
  public icAgruparCol = faObjectGroup;
  public icAddPuesto = faPlusCircle;
  public gridView: GridDataResult;
  public datos: Puesto[];
  private popupRef: PopupRef;
  public state: State = {
    skip: 0,
    take: 15,
    group: [],

  };
  public groupable: boolean = false;

  ngOnInit() {
    this.loadDatos();
  }

  constructor(private popupService: PopupService, private appService: AppService) {
  }

  private loadDatos(): void {
    this.appService.getJSON()
      .subscribe((data: any) => {
        this.datos = data;
        this.gridView = process(this.datos, this.state)
      });
  }


  public dataStateChange(state): void {
    this.state = state;
    this.loadDatos();
  }

  //Grouping Methods
  public isGroupable(): void {
    if (this.groupable === false) {
      this.state.group.splice(0, this.state.group.length)
    }
    this.groupable = !this.groupable;
  }


  //Global Search
  public onFilter(inputValue: string): void {
    this.gridView = process(this.datos, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "puesto.id",
            operator: "contains",
            value: inputValue,
          }
        ],
      },
    });
  }
}
