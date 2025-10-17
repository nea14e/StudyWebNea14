export enum DbTaskItemType {
  BeginTransaction = 'BeginTransaction',
  Table = 'Table',
  Scalar = 'Scalar',
  NonQuery = 'NonQuery',
  CommitTransaction = 'CommitTransaction',
  RollbackTransaction = 'RollbackTransaction',
  Empty = 'Empty'
}
