export const tableOfContents: TableOfContentsItem[] = [
  {
    id: 'weather-forecast',
    path: 'weather-forecast',
    title: 'Прогноз погоды',
    description: 'Пример запроса на бэкенд. Можно доработать его, улучшив отображение данных и изменив алгоритм генерации на бэкенде.'
  },
  {
    id: 'crud-example',
    path: 'crud-example',
    title: 'Простой пример CRUD',
    description: 'Простой пример CRUD (Create/Read/Update/Delete - Создать/Считать/Обновить/Удалить). Данные хранятся на бэкенде, пока он не завершится. Перезапуск бэкенда сбрасывает все изменения в данных.'
  }
];

export interface TableOfContentsItem {
  id: string;
  path: string;
  title: string;
  description: string;
}
