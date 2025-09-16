import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {Guid} from 'guid-typescript';
import {DbTaskExample} from '../models/db-task-example';

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
      this.http.get<DbTaskExample>(
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
