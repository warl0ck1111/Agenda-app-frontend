import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';

import {
  finalize,
} from 'rxjs/operators';
import { Agenda } from '../models/agenda-model';
import { ExcelService } from '../services/excel/excel.service';
import { AjaxResponse } from '../models/ajax-response-model';

@Component({
  selector: 'app-agenda-list',
  templateUrl: './agenda-list.component.html',
  styleUrls: ['./agenda-list.component.css']
})
export class AgendaListComponent implements OnInit {

  GET_ALL_AGENDAS_URL: string = "http://localhost:8080/api/agenda/get-all";
  DELETE_AGENDAS_URL: string = "http://localhost:8080/api/agenda/delete/";

  agendaList: Agenda[] = []

  importAgendas: Agenda[] = this.agendaList;
  exportAgendas: Agenda[] = [];


  spinnerEnabled = false;
  keys?: string[] | null;
  dataSheet: any = new Subject();
  @ViewChild('inputFile') inputFile!: ElementRef;
  isExcelFile!: boolean;


  alertMsg!: string;
  style!: string;
  show: boolean = false;
  interval: any;
  alertIcon!: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private excelService: ExcelService,
  ) { }


  ngOnInit(): void {
    this.findAllAgendas();
  }


  findAllAgendas() {
    this.http.get(this.GET_ALL_AGENDAS_URL).subscribe((response: AjaxResponse<Agenda[]>) => {
      this.agendaList = response.data as Agenda[];
      // console.log(response);

    })
  }

  gotoCreateAgenda() {
    this.router.navigate(['/create'])
  }

  gotoEditAgenda(agenda: Agenda) {
    sessionStorage.setItem('agenda', JSON.stringify(agenda))
    this.router.navigate(["/edit"]);
  }

  deleteAgenda(agenda: Agenda) {
    this.http.delete(`${this.DELETE_AGENDAS_URL}${agenda.id}`)
      .pipe(finalize(() => {
        this.findAllAgendas();
      }))
      .subscribe((response: any) => {

        if (response.status == "OK") {
          this.showAlert('Agenda Deleted Successfully', "warning", "info-circle")

          this.agendaList = response.data;

        }

        // console.log(response);

      }, (error: AjaxResponse<null>) => {
        this.showAlert(error.message as string, "warning", "warning")
      })
  }

  exportData(tableId: string) {
    this.excelService.exportToFile("contacts", tableId);
    this.showAlert("Data Exported Succesfully", "info", "info-circle")

  }

  /**
   * import .xls|.xlsx document
   * @param evt
   */
  onChange(evt: any) {
    this.agendaList = [];
    let data: any[], header: any;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);

        // console.log(data);

        this.agendaList = data
        this.agendaList.map(x => {
          if (typeof x.isCompleted == 'string') {

            x.isCompleted = JSON.parse(<string>(x.isCompleted))
            // console.log(x.isCompleted);
          }


        })

      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data)
      }
    } else {
      this.showAlert("Invalid Excel File", "warning", "info-circle")
      this.inputFile.nativeElement.value = '';
    }

    this.showAlert("Data Successfully Imported", "info", "info-circle")

  }


  showAlert(msg: string, style: string, icon: string) {
    this.alertIcon = icon;
    this.alertMsg = msg;
    this.style = style || 'info';
    this.show = true;
    timer(5000).subscribe(() => (this.show = false));
    return false;
  }


}
