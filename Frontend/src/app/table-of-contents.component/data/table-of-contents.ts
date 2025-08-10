export const tableOfContents: TableOfContentsItem[] = [
  {
    id: 'simple-request',
    path: '/simple-request',
    title: 'Простой запрос',
    description: `<p>Самый простой пример запроса на бэкенд.
    Только одна кнопка и текст, который приходит по нажатию на кнопку.</p>
    <p>Запрос посылается из компонента на фронте и обрабатывается в API-контроллере на бэкенде.
    Сервисы не используются.</p>`
  },
  {
    id: 'weather-forecast',
    path: '/weather-forecast',
    title: 'Прогноз погоды',
    description: `Пример запроса на бэкенд.
     <br/>Задания:
     <ul>
        <li>улучшить отображение данных;</li>
        <li>изменить алгоритм генерации на бэкенде.</li>
     </ul>`
  },
  {
    id: 'request-errors-example',
    path: '/request-errors-example',
    title: 'Простые ошибки в запросах',
    description: `Пример содержит ошибки в запросах к бэкенду, такие как:
    <ul>
        <li>неправильный порт бекенда;</li>
        <li>неправильный адрес запроса;</li>
        <li>неправильный тип запроса;</li>
        <li>неизвестный параметр запроса;</li>
        <li>параметр запроса имеет другой тип;</li>
        <li>параметр запроса не может распарситься.</li>
    </ul>`
  },
  {
    id: 'crud-example',
    path: '/crud-example',
    title: 'Простой пример CRUD',
    description: `Простой пример CRUD (Create/Read/Update/Delete - Создать/Считать/Обновить/Удалить).
    Данные хранятся на бэкенде, пока он не завершится. Перезапуск бэкенда сбрасывает все изменения в данных.`
  }
];

export interface TableOfContentsItem {
  id: string;
  path: string;
  title: string;
  description: string;
}
