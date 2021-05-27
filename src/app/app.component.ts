import { Component } from '@angular/core';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import * as data from './puestos.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public gridView: GridDataResult;
  public datos: any[] = (data as any).default;


  public state: State = {
    skip: 0,
    take: 10
  };

  constructor() {
    this.loadDatos();
  }

  private loadDatos(): void {
    this.gridView = process(this.datos, this.state);
  }

  public dataStateChange(state): void {
    this.state = state;
    this.loadDatos();
  }
}
