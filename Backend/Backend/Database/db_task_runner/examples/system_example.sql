insert into db_task_runner.db_task_examples(key, title, "order", description_html)
values ('system_example', '(Системный пример)', 1, '<p>Этот пример показывает, как работает система примеров базы данных.</p>
    <p>
        Выберите нужный пример из списка, а затем запускайте по очереди наброски кода из него.
        Чтобы узнать результат какого-нибудь SELECT, наведите на него мышку или нажмите на него, 
        чтобы открыть результат в диалоговом окне. 
    </p>
    <p>
        Чтобы создать новый пример, создайте новый скрипт в папке Backend/Backend/Database/db_task_runner/examples/
        и запустите этот скрипт в БД. При изменении скрипта потребуется перезапустить бэкенд и обновить страницу браузера.
    </p>')
on conflict on constraint pk_db_task_examples
    do update
    set title            = excluded.title,
        "order"          = excluded."order",
        description_html = excluded.description_html;

with data(example_key, key, "order", description_html) as (values ('system_example', 'simple', 1,
                                                                   '<p>Вот простые наброски кода. Первый SELECT возвращает скалярное (одиночное) значение, второй не возвращает ничего, а третий возвращает таблицу из двух столбцов и 10 строк. Обратите внимание, что SELECT может вернуть не только таблицу, но и число или не возвращать ничего:</p>'),
                                                                  ('system_example', 'error', 2,
                                                                   '<p>Этот пример выдаёт ошибку:</p>'))
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
         (values ('71a30676-6d83-46e2-b879-5db58a010100'::uuid,
                  'system_example', 'simple', 1),
                 ('df5cb29d-3d04-4f77-89e7-db3262020100'::uuid,
                  'system_example', 'error', 1)),
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
         (values ('71a30676-6d83-46e2-b879-5db58a010101'::uuid,
                  '71a30676-6d83-46e2-b879-5db58a010100'::uuid,
                  1,
                  'Scalar',
                  'select 123;',
                  '<span class="sql-keyword">select </span><span class="sql-number">123</span><span class="sql-sign">;</span>'),
                 ('71a30676-6d83-46e2-b879-5db58a010102'::uuid,
                  '71a30676-6d83-46e2-b879-5db58a010100'::uuid,
                  2,
                  'NonQuery',
                  'select pg_sleep(3);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">3</span><span class="sql-sign">);</span>'),
                 ('71a30676-6d83-46e2-b879-5db58a010103'::uuid,
                  '71a30676-6d83-46e2-b879-5db58a010100'::uuid,
                  3,
                  'Table',
                  'select ser.i as id,
ser.i % 2 = 0 as flag
from generate_series(1, 10) ser(i);',
                  '<span class="sql-keyword">select ser</span><span class="sql-sign">.</span><span class="sql-keyword">i as </span><span class="sql-alias">id</span><span class="sql-sign">,</span><br/>
    <span class="sql-keyword">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ser</span><span class="sql-sign">.</span><span class="sql-keyword">i </span><span class="sql-other">% </span><span class="sql-number">2 </span><span class="sql-other">= </span><span class="sql-number">0 </span><span class="sql-keyword">as </span><span class="sql-alias">flag</span><br/>
    <span class="sql-keyword">from </span><span class="sql-function">generate_series</span><span class="sql-other">(</span><span class="sql-number">1</span><span class="sql-sign">, </span><span class="sql-number">10</span><span class="sql-other">) </span>
    <span class="sql-keyword">ser</span><span class="sql-other">(</span><span class="sql-keyword">i</span><span class="sql-other">)</span><span class="sql-sign">;</span>'),
                 ('df5cb29d-3d04-4f77-89e7-db3262020101'::uuid,
                  'df5cb29d-3d04-4f77-89e7-db3262020100'::uuid,
                  1,
                  'Scalar',
                  'select 123 / 0;',
                  '<span class="sql-keyword">select </span><span class="sql-number">123 </span><span class="sql-sign">/ </span><span class="sql-number">0</span><span class="sql-sign">;</span>')),
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