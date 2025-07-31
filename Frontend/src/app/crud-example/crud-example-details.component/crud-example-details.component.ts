import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Guid} from 'guid-typescript';
import {CrudExampleDetailsService} from './services/crud-example-details.service';
import {CrudExampleDetailsModel} from './models/crud-example-details.model';
import {FormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {generateGuid} from '../../common/guids-helper';

@Component({
  selector: 'app-crud-example-details',
  imports: [
    FormsModule
  ],
  templateUrl: './crud-example-details.component.html',
  styleUrl: './crud-example-details.component.css'
})
export class CrudExampleDetailsComponent implements OnInit {
  private id?: Guid;
  details?: CrudExampleDetailsModel;
  isLoading = false;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(CrudExampleDetailsService);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('id') && !!paramMap.get('id')) {
        this.id = Guid.parse(paramMap.get('id')!);
        this.loadById();
      } else {
        this.id = undefined;
        this.createNew();
      }
    });
  }

  private loadById() {
    this.isLoading = true;
    this.service.read(this.id!).subscribe(details => {
      this.details = details;
      console.log('load:', this.details);
      this.isLoading = false;
    })
  }

  private createNew() {
    this.details = {} as CrudExampleDetailsModel;
    this.details.id = generateGuid();
    console.log('create:', this.details);
    this.isLoading = false;
  }

  get isNew() {
    return !this.id;
  }

  async onSaveClick() {
    this.isLoading = true;
    let observable;
    console.log('save', this.details);
    if (this.isNew) {
      observable = this.service.create(this.details!);
    } else {
      observable = this.service.update(this.details!);
    }
    await firstValueFrom(observable);
    await this.router.navigate(['crud-example']);
    this.isLoading = false;
  }

  async onCancelClick() {
    this.isLoading = true;
    await this.router.navigate(['crud-example']);
    this.isLoading = false;
  }
}
