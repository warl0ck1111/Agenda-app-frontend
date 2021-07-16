import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaListComponent } from './agenda-list/agenda-list.component';
import { AgendaComponent } from './agenda/agenda.component';

const routes: Routes = [
  {
    path:"", component:AgendaListComponent

  },
  {
    path:"home", component:AgendaListComponent

  },

  {
    path:"create", component:AgendaComponent

  },
  {
    path:"edit", component:AgendaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
