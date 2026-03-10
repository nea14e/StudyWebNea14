insert into db_task_runner.db_task_examples(key, title, "order", description_html)
values ('phantom_read', 'Фантомное чтение', 3020, '<p>На уровне изоляции <b>Read Committed</b> (по умолчанию в Postgres) каждая операция видит все зафиксированные
        изменения других транзакций.
        Если между двумя операциями успела завершиться другая транзакция, то её изменения становятся видны второй
        операции.
        Обычно это не плохо, но могут возникнуть такие явления, как неповторяемое чтение и фантомное чтение.
        <b>Фантомное чтение &mdash;</b> явление, когда одна транзакция видит изменяющийся набор строк из-за того, что
        другая транзакция завершилась между её двумя операциями.
        В нашем примере фантомного чтения мы покажем, как удаление строк во второй транзакции может не работать.
    </p>
    <p>
        По идее, оно должно было удалить все чётные строки, если DELETE
        запустился до UPDATE из первой транзакции или все нечётные, если он запустился после; однако <b>удаления
        не происходит <i>вообще:</i></b>
    <ul>
        <li>DELETE начинает удалять строки. Под условие подходят все чётные строки;</li>
        <li>DELETE запоминает найденные строки и ждёт, пока первая транзакция снимет с них блокировку;</li>
        <li>Когда блокировка снимается, DELETE заново проверяет условие, потому что понимает, что оно могло измениться в
            другой транзакции;
            однако, он проверяет <b>только</b> те строки, которые собирается удалить, а остальные строки не
            перепроверяет.
        </li>
    </ul>
    <p>
        В итоге, те строки, которые изначально подходили под условие и были выбраны для удаления, больше не подходят.
        А те строки, которые изначально не подходили под условие, больше не перепроверяются.
        Итак, не удаляется ни одна строка.
    </p>')
on conflict on constraint pk_db_task_examples
    do update
    set title            = excluded.title,
        "order"          = excluded."order",
        description_html = excluded.description_html;

with data(example_key, key, "order", description_html) as (values ('phantom_read', 'pre', 1,
                                                                   '<p>Создаём 10 строк. Чётные строки будут помечены флажками для удаления:</p>'),
                                                                  ('phantom_read', 'main', 2,
                                                                   '<b>Собственно пример. Удаляем строки, одновременно меняя флажки: снимаем флажки с чётных строк, ставим на нечётные:</b>'),
                                                                  ('phantom_read', 'check', 3,
                                                                   '<p>Проверяем результат. Ни одна строка не удалилась:<p>'))
insert
into db_task_runner.db_task_snippets (example_key, key, "order", description_html)
select *
from data
on conflict on constraint pk_db_task_snippets
    do update
    set "order"          = excluded."order",
        description_html = excluded.description_html,
        is_deleted       = false
returning example_key, key, "order";

-- select gen_random_uuid();

with data(id, example_key, snippet_key, process_number) as
         (values ('a98e3922-48e4-46ca-9afc-026da3010100'::uuid,
                  'phantom_read', 'pre', 1),
                 ('a98e3922-48e4-46ca-9afc-026da3020100'::uuid,
                  'phantom_read', 'main', 1),
                 ('a98e3922-48e4-46ca-9afc-026da3020200',
                  'phantom_read', 'main', 2),
                 ('a98e3922-48e4-46ca-9afc-026da3030100'::uuid,
                  'phantom_read', 'check', 1)),
     upd as (
         update db_task_runner.db_task_processes tgt
             set example_key = data.example_key,
                 snippet_key = data.snippet_key,
                 process_number = data.process_number,
                 is_deleted = false
             from data
             where data.id = tgt.id
             returning tgt.id)
insert
into db_task_runner.db_task_processes (id, example_key, snippet_key, process_number)
select *
from data
where not exists(select 1
                 from upd
                 where upd.id = data.id);

with data(id, process_id, "order", "type", sql, frontend_html) as
         (values ('a98e3922-48e4-46ca-9afc-026da3010101'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3010100'::uuid,
                  1,
                  'NonQuery',
                  'truncate concurrency.big_data;',
                  '<span class="sql-keyword">truncate</span> <span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span><span class="sql-sign">;</span>'),
                 ('a98e3922-48e4-46ca-9afc-026da3010102'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3010100'::uuid,
                  2,
                  'Table',
                  'insert into concurrency.big_data(id, flag)
select ser.i         as id,
       ser.i % 2 = 0 as flag
from generate_series(1, 10) ser(i)
returning id, flag;',
                  '<span class="sql-keyword">insert into </span>
    <span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span>
    <span class="sql-other">(</span><span class="sql-keyword">id</span><span class="sql-other">, </span><span class="sql-keyword">flag</span><span class="sql-other">)</span><br/>
    <span class="sql-keyword">select ser</span><span class="sql-sign">.</span><span class="sql-keyword">i as </span><span class="sql-alias">id</span><span class="sql-sign">,</span><br/>
    <span class="sql-keyword">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ser</span><span class="sql-sign">.</span><span class="sql-keyword">i </span><span class="sql-other">% </span><span class="sql-number">2 </span><span class="sql-other">= </span><span class="sql-number">0 </span><span class="sql-keyword">as </span><span class="sql-alias">flag</span><br/>
    <span class="sql-keyword">from </span><span class="sql-function">generate_series</span><span class="sql-other">(</span><span class="sql-number">1</span><span class="sql-sign">, </span><span class="sql-number">10</span><span class="sql-other">) </span>
    <span class="sql-keyword">ser</span><span class="sql-other">(</span><span class="sql-keyword">i</span><span class="sql-other">)</span><br/>
    <span class="sql-keyword">returning id</span><span class="sql-sign">, </span><span class="sql-keyword">flag</span><span class="sql-sign">;</span>'),
                 ('a98e3922-48e4-46ca-9afc-026da3020101'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3020100'::uuid,
                  1,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('a98e3922-48e4-46ca-9afc-026da3020102'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3020100'::uuid,
                  2,
                  'NonQuery',
                  'update concurrency.big_data
set flag = (id % 2 = 1)
where true;',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span><br/>
    <span class="sql-keyword">set flag </span><span class="sql-other">= (</span><span class="sql-keyword">id </span><span class="sql-other">% </span><span class="sql-number">2 </span><span class="sql-other">= </span><span class="sql-number">1</span><span class="sql-other">)</span><br/>
    <span class="sql-keyword">where true</span><span class="sql-sign">;</span>'),
                 ('a98e3922-48e4-46ca-9afc-026da3020103'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3020100'::uuid,
                  3,
                  'NonQuery',
                  'select pg_sleep(10);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">10</span><span class="sql-sign">);</span>'),
                 ('a98e3922-48e4-46ca-9afc-026da3020104'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3020100'::uuid,
                  4,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('a98e3922-48e4-46ca-9afc-026da3020201'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3020200'::uuid,
                  1,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('a98e3922-48e4-46ca-9afc-026da3020202'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3020200'::uuid,
                  2,
                  'NonQuery',
                  'select pg_sleep(3);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">3</span><span class="sql-sign">);</span>'),
                 ('a98e3922-48e4-46ca-9afc-026da3020203'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3020200'::uuid,
                  3,
                  'NonQuery',
                  'delete from concurrency.big_data
where flag;',
                  '<span class="sql-keyword">delete from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span><br/>
    <span class="sql-keyword">where flag</span><span class="sql-sign">;</span>'),
                 ('a98e3922-48e4-46ca-9afc-026da3020204'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3020200'::uuid,
                  4,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('a98e3922-48e4-46ca-9afc-026da3030101'::uuid,
                  'a98e3922-48e4-46ca-9afc-026da3030100'::uuid,
                  1,
                  'Table',
                  'select *
from concurrency.big_data
order by id;',
                  '<span class="sql-keyword">select </span><span class="sql-other">*</span><br/>
    <span class="sql-keyword">from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span><br/>
    <span class="sql-keyword">order by id</span><span class="sql-sign">;</span>')),
     upd as (
         update db_task_runner.db_task_items tgt
             set process_id = data.process_id,
                 "order" = data."order",
                 "type" = data."type",
                 sql = data.sql,
                 frontend_html = data.frontend_html,
                 is_deleted = false
             from data
             where tgt.id = data.id
             returning 'updated' as operation, data.id, data.process_id, data."order", coalesce(data.sql, data.type) as sql),
     ins as (
         insert into db_task_runner.db_task_items (id, process_id, "order", "type", sql, frontend_html)
             select *
             from data
             where not exists(select 1
                              from upd
                              where upd.id = data.id)
             returning 'inserted' as operation, id, process_id, "order", coalesce(sql, type) as sql)
select t.process_id, t."order", t.sql
from (select *
      from upd
      union all
      select *
      from ins) t
order by t.process_id, t."order";