import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { finalize, findIndex } from 'rxjs/operators';
import { Agenda } from '../models/agenda-model';
import { AjaxResponse } from '../models/ajax-response-model';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit, OnDestroy {

  title: string = "Create New"
  actionButtonText = "Create"
  actionButtonIcon = "plus-circle"
  agendaForm!: FormGroup
  agendaList!: Agenda[] | null
  agenda!: Agenda | null
  isUpdate: boolean = false;

  alertMsg!: string;
  style!: string;
  show: boolean = false;
  interval: any;
  alertIcon!: string;

  constructor(private http: HttpClient,
    private router: Router,
    private fb: FormBuilder) {
    this.initializeForm()
  }


  ngOnInit(): void {

    if (sessionStorage.getItem('agenda')) { //if it is an update populate fields
      let a = sessionStorage.getItem("agenda");
      console.log(a)
      this.agenda = JSON.parse(a == null ? "{}" : a);
      this.initializeFormwithData()
      this.title = "Update "
      this.actionButtonText = "Update"
      this.actionButtonIcon = "paper-plane"
      this.isUpdate = true
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("agenda")
  }

  initializeForm() {
    this.agendaForm = this.fb.group({
      name: ['', Validators.required],
      details: ['', Validators.required],
      date: ['', Validators.required],
      isCompleted: [false],
      title: ['', Validators.required],
      isImportant: [false],
      isDeleted: [false],

    })
  }


  initializeFormwithData() {
    this.agendaForm = this.fb.group({
      name: [this.agenda?.name, Validators.required],
      id: [this.agenda?.id, Validators.required],
      details: [this.agenda?.details, Validators.required],
      date: [this.agenda?.date, Validators.required],
      isCompleted: [this.agenda?.isCompleted],
      title: [this.agenda?.title, Validators.required],
      isImportant: [this.agenda?.isImportant],
      isDeleted: [this.agenda?.isDeleted],

    })
  }


  createUpdateAgenda() {

    if (sessionStorage.getItem("agenda")) {
      this.updateAgenda();
    }
    else {
      this.createAgenda();
    }

  }


  createAgenda() {


    if(!this.agendaForm.status){
      this.check()
      this.canPerformAction = false
      return;
    }
    console.log(this.agendaForm.value);

    this.http.post<Agenda>("http://localhost:8080/api/agenda/create", this.agendaForm.value)
      .pipe(finalize(() => {
        this.router.navigate(['/home'])
      }))
      .subscribe((response: any) => {

      },
        (error: any) => {

        })
  }


  canPerformAction:boolean = false;
  updateAgenda() {

    if(!this.agendaForm.status){
      this.canPerformAction = false
      return;
    }

    console.log(this.agendaForm.value);


    this.http.put<Agenda>("http://localhost:8080/api/agenda/update", this.agendaForm.value)
      .pipe(finalize(() => {
        this.goBack()
      }))
      .subscribe((response: any) => {



      },
        (error: any) => {

        })
  }


  goBack() {
    window.history.back();
  }

  check(){
    console.log((this.agendaForm));

  }





}
