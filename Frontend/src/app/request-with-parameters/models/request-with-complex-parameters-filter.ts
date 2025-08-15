export interface RequestWithComplexParametersFilter {
  title?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Поскольку query-параметры со значением null - это не работает,
// то задаём только те параметры, значение которых не-null:
export function filterToParams(filter: RequestWithComplexParametersFilter) {
  const params: any = {};
  if (!!filter.title)
    params.title = filter.title;
  if (!!filter.dateFrom)
    params.dateFrom = filter.dateFrom;
  if (!!filter.dateTo)
    params.dateTo = filter.dateTo;
  return params;
}
