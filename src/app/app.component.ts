import { Component, OnInit } from '@angular/core';
import { GridDataResult, RowClassArgs, SelectableSettings } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { faFileExport, faTag } from '@fortawesome/free-solid-svg-icons';
import { AppService } from './app.service';
import { Puesto } from './model-puestos';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public icTag = faTag;
  public icFileExp = faFileExport;

  public gridView: GridDataResult;
  public datos: Puesto[];
  public state: State = {
    skip: 0,
    take: 15,
    group: [],
    sort: [{
      field: "puesto.puestoId",
      dir: "asc"
    }],
  };
  public groupable: boolean = false;
  public commonFilter = "";
  public formGroup: FormGroup;
  private editedRowIndex: number;
  public selectableSettings: SelectableSettings;
  public loading: boolean = true;

  ngOnInit() {
    this.loadDatos();
  }

  constructor(private appService: AppService, private formBuilder: FormBuilder) {
    this.setSelectableSettings();
  }

  private loadDatos(): void {
    this.appService.getJSON()
      .subscribe((data: any) => {
        this.datos = data;
        this.gridView = process(this.datos, this.state)
        this.loading = false;
      });
  }

  public dataStateChange(state): void {
    this.state = state;
    this.loadDatos();
  }

  //CRUD
  public createFormGroup(dataItem: Puesto): FormGroup {
    const item = dataItem || new Puesto();

    return this.formGroup = this.formBuilder.group({
      id: new FormControl(item.id),
      puesto: new FormGroup({
        puestoId: new FormControl(item?.codigo?.id),
      }),
      puestoIdOficial: new FormControl(item.codOficial),
      puestoTipo: new FormGroup({
        nombre: new FormControl(item?.puestoTipo?.nombre)
      }),
      nombre: new FormControl(item.denominacion),
      tipoVinculo: new FormGroup({
        tipoVinculoId: new FormControl(item?.tipoVinculo?.nombre)
      }),

      catalogo: new FormGroup({
        nombre: new FormControl(item?.catalogo?.nombre)
      }),

      adscripcion: new FormGroup({
        nombre: new FormControl(item?.adscripcion?.nombre)
      }),

      grupo1Id: new FormControl(item.g1),
      grupo2Id: new FormControl(item.g2),

      escala: new FormGroup({
        nombre: new FormControl(item?.escala?.nombre)
      }),

      cuerpo: new FormGroup({
        nombre: new FormControl(item?.cuerpo?.nombre)
      }),
      formaProvision: new FormGroup({
        nombre: new FormControl(item?.formaProvision?.nombre)
      }),
      grupo1Importe: new FormControl(item.grupoImporte),
      complementoDestinoId: new FormControl(item.complementoDestinoId),
      complementoDestinoImporte: new FormControl(item.complementoDestinoImporte),
      complementoEspecificoId: new FormControl(item.complementoEspecificoId),
      complementoEspecificoImporte: new FormControl(item.complementoEspecificoImporte),
      dotaciones: new FormControl(item.dotaciones),
      ocupantes: new FormControl(item.ocupantes),
      vacantes: new FormControl(item.vacantes),
      dotado: new FormControl(item.dotado),
      singularizado: new FormControl(item.singularizado),
      reservadoNacionales: new FormControl(item.reservadoNacionales),
      disponibilidadPlena: new FormControl(item.disponibilidadPlena),
      personaDeConfianza: new FormControl(item.personaDeConfianza),
    });
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.formGroup = this.createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
    this.loadDatos();
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.formGroup = sender.addRow(this.createFormGroup(new Puesto()));
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
    this.loading = true;
    setTimeout(() => this.loadDatos(), 1000);

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
  //-//

  public isGroupable(): void {
    if (this.groupable === false) {
      this.state.group.splice(0, this.state.group.length)
    }
    this.groupable = !this.groupable;
  }

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

  public rowCallback = (context: RowClassArgs) => {
    switch (context.dataItem.tipoVinculo?.tipoVinculoId) {
      case 'F':
        return { cyan: true };
      case 'E':
        return { lila: true };
      case 'L':
        return { lila: true };
      case 'A':
        return { colorsito: true };
      default:
        return {};
    }
  };

  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: false,
      mode: "single",
      drag: false
    };
  }
}

