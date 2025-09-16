import {DbTaskItem} from './db-task-item';

export interface DbTaskProcess {
  processNumber: number;
  taskItems: DbTaskItem[];
}
