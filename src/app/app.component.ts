import { Component } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import * as data from './puestos.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public gridView: GridDataResult;
  public datos: any[] = (data as any).default;
  public sort: SortDescriptor[] = [
    {
      field: "puesto.id",
      dir: "asc",
    },
  ];


  constructor() {
    this.cargarDatos();
  }


  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.cargarDatos();
  }


  private cargarDatos(): void {
    this.gridView = {
      data: orderBy(this.datos, this.sort),
      total: this.datos.length,
    };

  }


}
