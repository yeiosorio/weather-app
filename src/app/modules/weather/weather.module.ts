import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherRoutingModule } from './weather-routing.module';
import { WeatherComponent } from './weather.component';
import { WeatherSearchComponent } from './components/weather-search/weather-search.component';
import { WeatherDetailComponent } from './components/weather-detail/weather-detail.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WeatherRoutingModule,
    WeatherComponent,
    WeatherSearchComponent,
    WeatherDetailComponent
  ]
})
export class WeatherModule { }
