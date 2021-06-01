import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { PopupService, PopupRef } from "@progress/kendo-angular-popup";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { AppService } from './app.service';

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
  public datos: any[] = [];
  private popupRef: PopupRef;
  public state: State = {
    skip: 0,
    take: 15,
    group: [],

  };
  private columns: string[] = ['Código', 'Código oficial', 'Puesto tipo', 'Denominación', 'TP', 'Catálogo', 'Adscripción administración', 'G1', 'G2', 'Escala', 'Cuerpo', 'Forma provisión'
    , 'Grupo (€)', 'ND', 'ND (€)', 'CE', 'CE (€)', 'Dot', 'Ocupantes', 'Vacantes', 'Dotado', 'PS', 'RN', 'PD', 'PC', 'Titulaciones'];
  private hiddenColumns: string[] = [];
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

  //Hide Columns Methods
  public togglePopup(anchor: ElementRef, template: TemplateRef<any>) {
    if (this.popupRef) {
      this.popupRef.close();
      this.popupRef = null;
    } else {
      this.popupRef = this.popupService.open({
        anchor: anchor,
        content: template,
      });
    }
  }

  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  public isDisabled(columnName: string): boolean {
    return (
      this.columns.length - this.hiddenColumns.length === 1 &&
      !this.isHidden(columnName)
    );
  }

  public hideColumn(columnName: string): void {
    const hiddenColumns = this.hiddenColumns;

    if (!this.isHidden(columnName)) {
      hiddenColumns.push(columnName);
    } else {
      hiddenColumns.splice(hiddenColumns.indexOf(columnName), 1);
    }
  }

  //Grouping Methods
  public isGroupable(): void {
    if (this.groupable === false) {
      this.state.group.splice(0, this.state.group.length)
    }
    this.groupable = !this.groupable;
  }

}
