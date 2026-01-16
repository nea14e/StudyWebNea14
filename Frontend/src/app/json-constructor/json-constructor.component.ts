import {Component, inject, OnInit} from '@angular/core';
import {JsonConstructorService} from './services/json-constructor.service';
import {JsonFieldComponent} from './json-field/json-field.component';
import {TitleComponent} from '../common/title/title.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-json-constructor',
  imports: [
    JsonFieldComponent,
    TitleComponent,
    MatProgressSpinner
  ],
  templateUrl: './json-constructor.component.html',
  styleUrl: './json-constructor.component.css'
})
export class JsonConstructorComponent implements OnInit {
  private service = inject(JsonConstructorService);
  isLoading = false;

  ngOnInit(): void {
    this.service.prettify('{"a":111,"b":222}').then(result => {
      console.log("prettify() result:", result);
    })
  }

  beginLoading() {
    this.isLoading = true;
  }

  endLoading() {
    this.isLoading = false;
  }
}
