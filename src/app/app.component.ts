import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
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
  public state: State = {
    skip: 0,
    take: 15,
    group: [],

  };
  public groupable: boolean = false;
  public commonFilter = "";


  ngOnInit() {
    this.loadDatos();
  }

  constructor(private appService: AppService) {
  }

  private loadDatos(): void {
    this.appService.getJSON()
      .subscribe((data: any) => {
        this.datos = data;
        this.gridView = process(this.datos, this.state)
      });
    this.refreshData();
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
  // public onFilter(inputValue: string): void {
  //   this.gridView = process(this.datos, {
  //     filter: {
  //       logic: "or",
  //       filters: [
  //         {
  //           field: "puesto.id",
  //           operator: "contains",
  //           value: inputValue,
  //         }
  //       ],
  //     },
  //   });
  // }

  public onFilter(inputValue: string): void {
    this.commonFilter = inputValue;
    this.refreshData();
  }

  private refreshData(): void {
    // Fem la primera busqueda per text
    let filtreBusqueda = this.datos;
    if (this.commonFilter.toLowerCase() !== null || this.commonFilter.trim().toLowerCase() !== '') {
      filtreBusqueda = filtreBusqueda
        .filter(
          // Filtrem els objectes que tenen algun valor de tipus string i que contingui el text buscat
          datos => Object.values(datos).filter(
            valor => typeof valor === 'string' && valor.indexOf(this.commonFilter) > -1
          ).length > 0
        );
    }
    this.gridView = process(filtreBusqueda, this.state);
  }
}
