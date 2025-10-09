insert into db_task_runner.db_task_examples(key, description_html)
values ('concurrent_update', '<p>Этот пример показывает, как при параллельном выполнении двух UPDATE
одной и той же строки <b>первый UPDATE блокирует строку,</b> так что второй UPDATE ждёт, пока первый закончится 
(транзакция первого завершится).</p>')
on conflict on constraint pk_db_task_examples
    do update
    set description_html = excluded.description_html;

with data(example_key, key, "order", description_html) as (values ('concurrent_update', 'pre', 1,
                                                                   '<p>Сбрасываем значение перед запуском примера:</p>'),
                                                                  ('concurrent_update', 'main', 2,
                                                                   '<b>Собственно пример:</b>'),
                                                                  ('concurrent_update', 'check', 3,
                                                                   '<p>Проверяем получившееся значение:<p>'))
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
         (values ('db20be13-de03-4616-8276-cd9c674a0100'::uuid,
                  'concurrent_update', 'pre', 1),
                 ('f844134d-7e47-4919-8522-6af7d4420100'::uuid,
                  'concurrent_update', 'main', 1),
                 ('f844134d-7e47-4919-8522-6af7d4420200',
                  'concurrent_update', 'main', 2),
                 ('22dc29c7-01c3-4699-9d14-a73f41100100'::uuid,
                  'concurrent_update', 'check', 1)),
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
         (values ('db20be13-de03-4616-8276-cd9c674a0101'::uuid,
                  'db20be13-de03-4616-8276-cd9c674a0100'::uuid,
                  1,
                  'NonQuery',
                  'update concurrency.data set "value" = ''Первоначальное значение'' where id = 1;',
                  '<span class="sql-keyword">update</span> <span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">data</span><br/>
<span class="sql-keyword">set</span> <span class="sql-identifier">"value"</span> <span class="sql-sign">=</span> <span class="sql-string">''Первоначальное значение''</span><br/>
<span class="sql-keyword">where</span> <span class="sql-identifier">id</span> <span class="sql-sign">=</span> <span class="sql-number">1</span><span class="sql-sign">;</span>'),
                 ('f844134d-7e47-4919-8522-6af7d4420101'::uuid,
                  'f844134d-7e47-4919-8522-6af7d4420100'::uuid,
                  1,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('f844134d-7e47-4919-8522-6af7d4420102'::uuid,
                  'f844134d-7e47-4919-8522-6af7d4420100'::uuid,
                  2,
                  'NonQuery',
                  'update concurrency.data
set "value" = ''Значение процесса №1''
where id = 1;',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">data</span><br/>
<span class="sql-keyword">set </span><span class="sql-identifier">&quot;value&quot; = </span><span class="sql-string">''Значение процесса №1''</span><br/>
<span class="sql-keyword">where </span><span class="sql-identifier">id = </span><span class="sql-number">1</span><span class="sql-sign">;</span>'),
                 ('f844134d-7e47-4919-8522-6af7d4420103'::uuid,
                  'f844134d-7e47-4919-8522-6af7d4420100'::uuid,
                  3,
                  'NonQuery',
                  'select pg_sleep(10);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">10</span><span class="sql-sign">);</span>'),
                 ('f844134d-7e47-4919-8522-6af7d4420104'::uuid,
                  'f844134d-7e47-4919-8522-6af7d4420100'::uuid,
                  4,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('f844134d-7e47-4919-8522-6af7d4420201'::uuid,
                  'f844134d-7e47-4919-8522-6af7d4420200'::uuid,
                  1,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('f844134d-7e47-4919-8522-6af7d4420202'::uuid,
                  'f844134d-7e47-4919-8522-6af7d4420200'::uuid,
                  2,
                  'NonQuery',
                  'select pg_sleep(2);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">2</span><span class="sql-sign">);</span>'),
                 ('f844134d-7e47-4919-8522-6af7d4420203'::uuid,
                  'f844134d-7e47-4919-8522-6af7d4420200'::uuid,
                  3,
                  'NonQuery',
                  'update concurrency.data
set "value" = ''Значение процесса №2''
where id = 1;',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">data</span><br/>
<span class="sql-keyword">set &quot;value&quot;</span><span class="sql-sign"> = </span><span class="sql-string">''Значение процесса №2''</span><br/>
<span class="sql-keyword">where id</span><span class="sql-sign"> = </span><span class="sql-number">1</span><span class="sql-sign">;</span>'),
                 ('f844134d-7e47-4919-8522-6af7d4420204'::uuid,
                  'f844134d-7e47-4919-8522-6af7d4420200'::uuid,
                  4,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('22dc29c7-01c3-4699-9d14-a73f41100101'::uuid,
                  '22dc29c7-01c3-4699-9d14-a73f41100100'::uuid,
                  1,
                  'Table',
                  'select "value" from concurrency.data where id = 1;',
                  '<span class="sql-keyword">select &quot;value&quot;<br/>
from</span> <span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">data</span><br/>
<span class="sql-keyword">where id</span><span class="sql-sign"> = </span><span class="sql-number">1</span><span class="sql-sign">;</span>')),
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