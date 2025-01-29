import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryListComponent } from './components/history-list/history-list.component';

const routes: Routes = [
  {
    path: '',
    component: HistoryListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule { }
