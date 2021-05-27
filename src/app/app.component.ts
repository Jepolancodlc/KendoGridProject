import { Component, ElementRef, TemplateRef } from '@angular/core';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import * as data from './puestos.json'
import { PopupService, PopupRef } from "@progress/kendo-angular-popup";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  icSearch = faSearch;
  icFileExp = faFileExport;
  icShowCol = faGripLinesVertical;
  icAgruparCol = faObjectGroup;
  public gridView: GridDataResult;
  public datos: any[] = (data as any).default;
  private popupRef: PopupRef;
  public state: State = {
    skip: 0,
    take: 10
  };
  public columns: string[] = ["ID", "Name", "Category"];
  public hiddenColumns: string[] = [];

  constructor(private popupService: PopupService) {
    this.loadDatos();
  }

  private loadDatos(): void {
    this.gridView = process(this.datos, this.state);
  }

  public dataStateChange(state): void {
    this.state = state;
    this.loadDatos();
  }

  //Hide Columns
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


}
