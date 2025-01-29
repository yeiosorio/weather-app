import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryRoutingModule } from './history-routing.module';
import { HistoryListComponent } from './components/history-list/history-list.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HistoryRoutingModule,
    HistoryListComponent
  ]
})
export class HistoryModule { }
