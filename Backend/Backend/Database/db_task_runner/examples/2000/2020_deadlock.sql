insert into db_task_runner.db_task_examples(key, title, "order", description_html)
values ('deadlock', 'Взаимоблокировка', 2020, '<p>Когда UPDATE обновляет строку, на неё навешивается блокировка, которая не даёт другим транзакциям обновлять эту же строку.
    Это логично: невозможно записать в строку два разных значения одновременно.</p>
<p>На практике это никак не мешает работать двум параллельным транзакциям: 
    когда первая транзакция изменила строку, вторая просто ждёт, пока первая завершится, 
    и затем пишет в эту же строку своё значение. 
    В итоге в строке получается то значение, которое было записано туда <b><i>последним.</i></b></p>
<p>Однако в некоторых случаях это может привести к <b>взаимоблокировке:</b>
<ol>
    <li><b>Первая</b> транзакция вешает блокировку на <b>строку 1</b>;</li>
    <li><b>Вторая</b> транзакция вешает блокировку на <b>строку 2</b>;</li>
    <li><b>Первая</b> транзакция пытается навесить блокировку на <b>строку 2,</b> но она уже занята второй транзакцией;</li>
    <li><b>Вторая</b> транзакция пытается навесить блокировку на <b>строку 1,</b> но она уже занята первой транзакцией.</li>
</ol>
</p>
<p>Получается, <b>первая транзакция ждёт вторую, а вторая &mdash; первую, и они не могут закончиться.</b>
    Чтобы исправить ситуацию, база данных обнаруживает взаимоблокировки и убивает одну из транзакций с ошибкой, а другая продолжает работу.</p>')
on conflict on constraint pk_db_task_examples
    do update
    set title            = excluded.title,
        "order"          = excluded."order",
        description_html = excluded.description_html;

with data(example_key, key, "order", description_html) as (values ('deadlock', 'before', 1,
                                                                   '<p>Сначала обнулим данные в таблице:</p>'),
                                                                  ('deadlock', 'main', 2,
                                                                   '<p>Одна из транзакций упадёт:</p>'),
                                                                  ('deadlock', 'after', 3,
                                                                   '<p>Результат: одна из транзакций выполнилась, а вторая &mdash; упала:</p>'))
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
         (values ('e72f4219-9c97-46ed-abeb-73f39c010100'::uuid,
                  'deadlock', 'before', 1),
                 ('e72f4219-9c97-46ed-abeb-73f39c020100'::uuid,
                  'deadlock', 'main', 1),
                 ('e72f4219-9c97-46ed-abeb-73f39c020200'::uuid,
                  'deadlock', 'main', 2),
                 ('e72f4219-9c97-46ed-abeb-73f39c030100'::uuid,
                  'deadlock', 'after', 1)),
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
         (values ('e72f4219-9c97-46ed-abeb-73f39c010101'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c010100'::uuid,
                  1,
                  'NonQuery',
                  'update concurrency.data
set "value" = ''Начальное значение''
where id in (1, 2);',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">concurrency</span><span class="sql-other">.</span><span class="sql-identifier">data</span><br/>
    <span class="sql-keyword">set "value" </span><span class="sql-sign">= </span><span class="sql-string">''Начальное значение''</span><br/>
    <span class="sql-keyword">where id in </span><span class="sql-sign">(</span><span class="sql-number">1</span><span class="sql-sign">, </span><span class="sql-number">2</span><span class="sql-sign">);</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c010102'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c010100'::uuid,
                  2,
                  'Table',
                  'select *
from concurrency.data
where id in (1, 2)
order by id;',
                  '<span class="sql-keyword">select </span><span class="sql-sign">*</span><br/>
    <span class="sql-keyword">from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">data</span><br/>
    <span class="sql-keyword">where id in </span><span class="sql-sign">(</span><span class="sql-number">1</span><span class="sql-sign">, </span><span class="sql-number">2</span><span class="sql-sign">)</span><br/>
    <span class="sql-keyword">order by id</span><span class="sql-sign">;</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c020101'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c020100'::uuid,
                  1,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c020102'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c020100'::uuid,
                  2,
                  'NonQuery',
                  'update concurrency.data
set "value" = ''Значение процесса №1''
where id = 1;',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">data</span><br/>
  <span class="sql-keyword">set &quot;value&quot;</span><span class="sql-sign"> = </span><span class="sql-string">''Значение процесса №1''</span><br/>
  <span class="sql-keyword">where id</span><span class="sql-sign"> = </span><span class="sql-number">1</span><span class="sql-sign">;</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c020103'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c020100'::uuid,
                  3,
                  'NonQuery',
                  'select pg_sleep(7);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">7</span><span class="sql-sign">);</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c020104'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c020100'::uuid,
                  4,
                  'NonQuery',
                  'update concurrency.data
set "value" = ''Значение процесса №1''
where id = 2;',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">data</span><br/>
  <span class="sql-keyword">set &quot;value&quot;</span><span class="sql-sign"> = </span><span class="sql-string">''Значение процесса №1''</span><br/>
  <span class="sql-keyword">where id</span><span class="sql-sign"> = </span><span class="sql-number">2</span><span class="sql-sign">;</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c020105'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c020100'::uuid,
                  5,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c020201'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c020200'::uuid,
                  1,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c020202'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c020200'::uuid,
                  2,
                  'NonQuery',
                  'update concurrency.data
set "value" = ''Значение процесса №2''
where id = 2;',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">data</span><br/>
  <span class="sql-keyword">set &quot;value&quot;</span><span class="sql-sign"> = </span><span class="sql-string">''Значение процесса №2''</span><br/>
  <span class="sql-keyword">where id</span><span class="sql-sign"> = </span><span class="sql-number">2</span><span class="sql-sign">;</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c020203'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c020200'::uuid,
                  3,
                  'NonQuery',
                  'select pg_sleep(7);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">7</span><span class="sql-sign">);</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c020204'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c020200'::uuid,
                  4,
                  'NonQuery',
                  'update concurrency.data
set "value" = ''Значение процесса №2''
where id = 1;',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">data</span><br/>
  <span class="sql-keyword">set &quot;value&quot;</span><span class="sql-sign"> = </span><span class="sql-string">''Значение процесса №2''</span><br/>
  <span class="sql-keyword">where id</span><span class="sql-sign"> = </span><span class="sql-number">1</span><span class="sql-sign">;</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c020205'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c020200'::uuid,
                  5,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('e72f4219-9c97-46ed-abeb-73f39c030101'::uuid,
                  'e72f4219-9c97-46ed-abeb-73f39c030100'::uuid,
                  1,
                  'Table',
                  'select *
from concurrency.data
where id in (1, 2)
order by id;',
                  '<span class="sql-keyword">select </span><span class="sql-sign">*</span><br/>
    <span class="sql-keyword">from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">data</span><br/>
    <span class="sql-keyword">where id in </span><span class="sql-sign">(</span><span class="sql-number">1</span><span class="sql-sign">, </span><span class="sql-number">2</span><span class="sql-sign">)</span><br/>
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