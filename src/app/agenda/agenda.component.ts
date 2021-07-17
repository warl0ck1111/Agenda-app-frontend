import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Agenda } from '../models/agenda-model';
import { AjaxResponse } from '../models/ajax-response-model';

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


  CREATE_AGENDA_URL: string = "http://localhost:8080/api/agenda/create";
  UPDATE_AGENDA_URL: string = "http://localhost:8080/api/agenda/update";

  alertMsg!: string;
  style!: string;
  show: boolean = false;
  interval: any;
  alertIcon!: string;

  constructor(private http: HttpClient,
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
    // console.log(this.agendaForm.value);

    this.http.post<Agenda>(this.CREATE_AGENDA_URL, this.agendaForm.value)
      .pipe(finalize(() => {

      }))
      .subscribe((response: any) => {
        if (response.status == "OK") {
          this.agendaForm.reset();
          this.showAlert('Agenda Created Successfully', "warning", "info-circle")
          timer(2500).subscribe(() => {
            this.goBack();
          });


        }
      },
        (error: AjaxResponse<null>) => {
          this.showAlert(<string>(error?.message), "warning", "info-circle")
        })
  }


  updateAgenda() {
    // console.log(this.agendaForm.value);
    this.http.put<Agenda>(this.UPDATE_AGENDA_URL, this.agendaForm.value)
      .pipe(finalize(() => {

      }))
      .subscribe((response: any) => {

        if (response.status == "OK") {
          this.agendaForm.reset();
          this.showAlert('Update Successful', "warning", "info-circle")
          timer(300).subscribe(() => {
            this.goBack();

          });


        }
      },
        (error: AjaxResponse<null>) => {
          this.showAlert(<string>(error?.message), "warning", "info-circle")
        })
  }


  goBack() {
    window.history.back();
  }

  //custom toast view
  showAlert(msg: string, style: string, icon: string) {
    this.alertIcon = icon;
    this.alertMsg = msg;
    this.style = style || 'info';
    this.show = true;
    timer(5000).subscribe(() => (this.show = false));
    return false;
  }



}
