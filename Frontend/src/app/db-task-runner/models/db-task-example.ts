import {DbTaskProcess} from './db-task-process';

export interface DbTaskExample {
  key: string;
  descriptionHtml: string;
  processes: DbTaskProcess[];
}
