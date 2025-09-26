import {DbTaskItemState} from './db-task-item-state';

export interface DbTaskItem {
  sql: string;
  frontendHtml: string;
  state: DbTaskItemState;
  exceptionMessage: string | null;
  result: (object | null)[][] | null;
}
