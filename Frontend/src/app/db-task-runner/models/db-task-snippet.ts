import {DbTaskProcess} from './db-task-process';

export interface DbTaskSnippet {
  key: string;
  order: number;
  descriptionHtml: string | null;
  processes: DbTaskProcess[];
}
