import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Agenda } from '../models/agenda-model';

@Component({
  selector: 'app-agenda-list',
  templateUrl: './agenda-list.component.html',
  styleUrls: ['./agenda-list.component.css']
})
export class AgendaListComponent implements OnInit {

  // agenda!:Agenda
  agendaList!: Agenda[]
  selectedId: any;

  isLoading: boolean = true;
  serviceTypeList: any[] = [];
  serviceTypeForm!: FormGroup;
  localServiceTypeList: any[] = [];
  noRecord!: boolean;
  isUploadLoading: boolean = false;
  updateData: any;
  createResponse!: any;
  isCreateLoading: boolean = false;
  selectedAssetId: any;
  isStampRequired: boolean = false;
  istaxable: boolean = false;
  instrumentNotFound: boolean = false;
  selectedCompany: any;
  searching: boolean = false;
  searchFailed: boolean = false;
  onInstrumentSelected: any;

  tablePage: number = 1;
  tablePageSize: number = 10;

  alertMsg!: string;
  style!: string;
  show: boolean = false;
  interval: any;
  icon!: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    sessionStorage.removeItem('id');
  }

  ngOnInit(): void {
    this.findAllAgendas();
  }


  findAllAgendas() {
    this.http.get("http://localhost:8080/api/agenda/get-all").subscribe((response: any) => {
      this.agendaList = response;
      console.log(response);

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
    this.http.delete(`http://localhost:8080/api/agenda/delete/${agenda.id}`)
    .pipe(finalize(()=>{
      this.findAllAgendas();
    }))
    .subscribe((response: any) => {
      this.agendaList = response;
      console.log(response);


    })
  }

  getStyleClass(){

  }
}
