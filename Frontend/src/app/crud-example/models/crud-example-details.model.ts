import {Guid} from 'guid-typescript';

export interface CrudExampleDetailsModel {
  id: Guid;
  name: string;
  description?: string;
}
