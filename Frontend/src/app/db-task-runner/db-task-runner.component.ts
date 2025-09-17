import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/input';
import {Component, inject} from '@angular/core';
import {DbTaskRunnerService} from './services/db-task-runner.service';
import {Guid} from 'guid-typescript';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {DbTaskExample} from './models/db-task-example';
import {getIndicesList, maxInList} from '../common/list-helper';
import {DbTaskItemState} from './models/db-task-item-state';
import {getPlainTextFromHtml} from '../common/text-helper';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-db-task-runner',
  imports: [
    FormsModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatSelectModule,
    CdkCopyToClipboard,
  ],
  templateUrl: './db-task-runner.component.html',
  styleUrl: './db-task-runner.component.css'
})
export class DbTaskRunnerComponent {
  example?: DbTaskExample;
  protected service = inject(DbTaskRunnerService);
  protected instanceId = Guid.create();

  async onExampleChanged($event: MatSelectChange<string>) {
    const exampleKey = $event.value;
    await this.service.loadExample(this.instanceId, exampleKey);
    this.example = await this.service.getProgress(this.instanceId);
    console.log('new example:', this.example);  // TODO
  }

  getProcessIndices() {
    const count = this.example!.processes.length;
    return getIndicesList(count)
  }

  getProcessByIndex(processIndex: number) {
    return this.example!.processes[processIndex];
  }

  getTaskIndices() {
    const maxLength = maxInList(this.example!.processes.map(proc => proc.taskItems.length));
    return getIndicesList(maxLength);
  }

  getTaskByIndices(processIndex: number, taskIndex: number) {
    return this.example!.processes[processIndex].taskItems[taskIndex];
  }

  protected readonly DbTaskItemState = DbTaskItemState;

  getCodeToCopy(processIndex: number) {
    const process = this.example!.processes[processIndex];
    return process.taskItems.map(item => item.frontendHtml)
      .map(html => getPlainTextFromHtml(html))
      .join('\n\n');
  }
}
