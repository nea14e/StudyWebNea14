insert into db_task_runner.db_task_examples(key, title, "order", description_html)
values ('serialization_anomaly', 'Аномалия сериализации', 3030, '<p>На уровне изоляции <b>Repeatable Read</b> невозможны такие аномалии,
    как неповторяемое чтение и фантомное чтение. Однако по-прежнему возможны аномалии сериализации.
    Это когда при параллельном выполнении двух транзакций результат получается таким,
        который был бы невозможен при последовательном выполнении.</p>
    <p>Рассмотрим пример:</p>')
on conflict on constraint pk_db_task_examples
    do update
    set title            = excluded.title,
        "order"          = excluded."order",
        description_html = excluded.description_html;

with data(example_key, key, "order", description_html) as (values ('serialization_anomaly', 'pre', 1,
                                                                   '<p>Очистим таблицу для тестовых данных:</p>'),
                                                                  ('serialization_anomaly', 'main', 2,
                                                                   '<b>Собственно пример. Подсчитаем сумму первой группы и положим её во вторую группу, и наоборот, сумму второй группы положим в первую:</b>'),
                                                                  ('serialization_anomaly', 'check', 3,
                                                                   '<p>Проверяем результат:<p>'))
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
         (values ('7a73b7ab-21d8-46fa-8f90-399b54010100'::uuid,
                  'serialization_anomaly', 'pre', 1),
                 ('7a73b7ab-21d8-46fa-8f90-399b54020100'::uuid,
                  'serialization_anomaly', 'main', 1),
                 ('7a73b7ab-21d8-46fa-8f90-399b54020200',
                  'serialization_anomaly', 'main', 2),
                 ('7a73b7ab-21d8-46fa-8f90-399b54030100'::uuid,
                  'serialization_anomaly', 'check', 1)),
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
         (values ('7a73b7ab-21d8-46fa-8f90-399b54010101'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54010100'::uuid,
                  1,
                  'NonQuery',
                  'truncate concurrency.groups;',
                  '<span class="sql-keyword">truncate</span> <span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">groups</span><span class="sql-sign">;</span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54010102'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54010100'::uuid,
                  2,
                  'NonQuery',
                  'insert into concurrency.groups (group_key, "value")
                  values
                      (1, 10),
                      (1, 20),
                      (2, 100),
                      (2, 200);',
                  '<span class="sql-keyword">insert into </span>
    <span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">groups</span>
    <span class="sql-other">(</span><span class="sql-keyword">group_key</span><span class="sql-other">, </span><span class="sql-keyword">"value"</span><span class="sql-other">)</span><br/>
    <span class="sql-keyword">values </span><br/>
    <span class="sql-sign">&nbsp;&nbsp;&nbsp;&nbsp;(</span><span class="sql-number">1</span><span class="sql-sign">, </span><span class="sql-number">10</span><span class="sql-sign">),</span><br/>
    <span class="sql-sign">&nbsp;&nbsp;&nbsp;&nbsp;(</span><span class="sql-number">1</span><span class="sql-sign">, </span><span class="sql-number">20</span><span class="sql-sign">),</span><br/>
    <span class="sql-sign">&nbsp;&nbsp;&nbsp;&nbsp;(</span><span class="sql-number">2</span><span class="sql-sign">, </span><span class="sql-number">100</span><span class="sql-sign">),</span><br/>
    <span class="sql-sign">&nbsp;&nbsp;&nbsp;&nbsp;(</span><span class="sql-number">2</span><span class="sql-sign">, </span><span class="sql-number">200</span><span class="sql-sign">)</span><span class="sql-sign">;</span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54010103'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54010100'::uuid,
                  3,
                  'Table',
                  'select *
from concurrency.groups
order by group_key, value;',
                  '<span class="sql-keyword">select </span><span class="sql-other">*</span><br/>
    <span class="sql-keyword">from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">groups</span><br/>
    <span class="sql-keyword">order by </span><span class="sql-identifier">group_key</span><span class="sql-sign">, </span><span class="sql-identifier">value</span><span class="sql-sign">;</span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54020101'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54020100'::uuid,
                  1,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54020102'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54020100'::uuid,
                  2,
                  'NonQuery',
                  'insert into concurrency.groups(group_key, value)
select 2, sum(value)
from concurrency.groups
where group_key = 1;',
                  '<span class="sql-keyword">insert into </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">groups</span>
    <span class="sql-sign">(</span><span class="sql-identifier">group_key</span><span class="sql-sign">, </span><span class="sql-identifier">value</span><span class="sql-sign">)</span><br/>
    <span class="sql-keyword">select </span><span class="sql-number">2</span><span class="sql-sign">, </span><span class="sql-function">sum</span><span class="sql-sign">(</span><span class="sql-identifier">value</span><span class="sql-sign">)</span><br/>
    <span class="sql-keyword">from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">groups</span><br/>
    <span class="sql-keyword">where </span><span class="sql-identifier">group_key </span><span class="sql-sign">= </span><span class="sql-number">1</span><span class="sql-sign"></span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54020103'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54020100'::uuid,
                  3,
                  'NonQuery',
                  'select pg_sleep(10);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">10</span><span class="sql-sign">);</span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54020104'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54020100'::uuid,
                  4,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54020201'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54020200'::uuid,
                  1,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54020202'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54020200'::uuid,
                  2,
                  'NonQuery',
                  'select pg_sleep(10);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">10</span><span class="sql-sign">);</span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54020203'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54020200'::uuid,
                  3,
                  'NonQuery',
                  'insert into concurrency.groups(group_key, value)
select 1, sum(value)
from concurrency.groups
where group_key = 2;',
                  '<span class="sql-keyword">insert into </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">groups</span>
    <span class="sql-sign">(</span><span class="sql-identifier">group_key</span><span class="sql-sign">, </span><span class="sql-identifier">value</span><span class="sql-sign">)</span><br/>
    <span class="sql-keyword">select </span><span class="sql-number">1</span><span class="sql-sign">, </span><span class="sql-function">sum</span><span class="sql-sign">(</span><span class="sql-identifier">value</span><span class="sql-sign">)</span><br/>
    <span class="sql-keyword">from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">groups</span><br/>
    <span class="sql-keyword">where </span><span class="sql-identifier">group_key </span><span class="sql-sign">= </span><span class="sql-number">2</span><span class="sql-sign"></span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54020204'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54020200'::uuid,
                  4,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('7a73b7ab-21d8-46fa-8f90-399b54030101'::uuid,
                  '7a73b7ab-21d8-46fa-8f90-399b54030100'::uuid,
                  1,
                  'Table',
                  'select *
from concurrency.groups
order by group_key, value;',
                  '<span class="sql-keyword">select </span><span class="sql-other">*</span><br/>
    <span class="sql-keyword">from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">groups</span><br/>
    <span class="sql-keyword">order by </span><span class="sql-identifier">group_key</span><span class="sql-sign">, </span><span class="sql-identifier">value</span><span class="sql-sign">;</span>')),
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