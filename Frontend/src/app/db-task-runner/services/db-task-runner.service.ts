import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {DbTaskItem} from '../models/db-task-item';
import {Guid} from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class DbTaskRunnerService {
  private http = inject(HttpClient);

  loadExample(instanceId: Guid, exampleKey: string) {
    return firstValueFrom(
      this.http.get<void>(
        environment.backendBaseUrl + `/api/db-task-runner/load-example`,
        {
          params: {
            instanceId: instanceId.toString(),
            exampleKey
          }
        }
      )
    );
  }

  getProgress(instanceId: Guid) {
    return firstValueFrom(
      this.http.get<DbTaskItem[][]>(
        environment.backendBaseUrl + `/api/db-task-runner/get-progress`,
        {
          params: {
            instanceId: instanceId.toString()
          }
        }
      )
    );
  }
}
