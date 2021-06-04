import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { faCheck, faObjectUngroup, faPencilAlt, faPlus, faSearch, faThList, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { faObjectGroup, faGripLinesVertical, faFileExport, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { AppService } from './app.service';
import { Puesto } from './model-puestos';
import { FormControl, FormGroup } from '@angular/forms';
import { PopupService, PopupRef } from "@progress/kendo-angular-popup";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public icDesagrupCol = faObjectUngroup;
  public icEdit = faPencilAlt;
  public icCheck = faCheck;
  public icCancelar = faUndo;
  public icRemove = faTrash;
  public icList = faThList;
  public icSearch = faSearch;
  public icPlus = faPlus;
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
  public formGroup: FormGroup;
  private editedRowIndex: number;
  private popupRef: PopupRef;


  ngOnInit() {
    this.loadDatos();
  }

  constructor(private appService: AppService, private popupService: PopupService,) {
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
          { field: "id", operator: "contains", value: inputValue },
          { field: "puestoIdOficial", operator: "contains", value: inputValue },
          { field: "puestoTipo.nombreCompleto", operator: "contains", value: inputValue },
          { field: "nombre", operator: "contains", value: inputValue },

        ],
      },
    });
  }

  //CRUD
  public editHandler({ sender, rowIndex, dataItem }) {
    this.formGroup = new FormGroup({
      'id': new FormControl(dataItem.id),
      'codigo': new FormControl(dataItem.codigo),
    });
    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
    this.loadDatos();
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      'id': new FormControl(),
      'codigo': new FormControl(),
    });

    sender.addRow(this.formGroup);
    this.loadDatos();
  }

  public cancelHandler({ sender, rowIndex }) {
    sender.closeRow(rowIndex)
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    const puesto: Puesto = formGroup.value;

    if (isNew) {
      this.appService.post(puesto).subscribe();
    } else {
      this.appService.put(puesto).subscribe();
    }
    sender.closeRow(rowIndex);
    this.loadDatos();
  }

  public removeHandler({ dataItem }) {
    this.appService.delete(dataItem).subscribe();
    this.loadDatos();
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }


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
}
