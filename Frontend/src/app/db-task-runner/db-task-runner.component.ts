import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/input';
import {Component, inject} from '@angular/core';
import {DbTaskItem} from './models/db-task-item';
import {DbTaskRunnerService} from './services/db-task-runner.service';
import {Guid} from 'guid-typescript';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-db-task-runner',
  imports: [
    FormsModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './db-task-runner.component.html',
  styleUrl: './db-task-runner.component.css'
})
export class DbTaskRunnerComponent {
  protected data: DbTaskItem[][] = [];
  protected service = inject(DbTaskRunnerService);
  protected instanceId = Guid.create();

  async onExampleChanged($event: MatSelectChange<string>) {
    const exampleKey = $event.value;
    await this.service.loadExample(this.instanceId, exampleKey);
    this.data = await this.service.getProgress(this.instanceId);
  }
}
