import {Guid} from 'guid-typescript';

export function generateGuid() {
  const complexGuid: any = Guid.create();  // Создаётся Guid2, который имеет собственно Guid внутри себя в поле value
  return complexGuid.value;  // Возвращаем просто строку. Этого достаточно для работы в рантайме
}
