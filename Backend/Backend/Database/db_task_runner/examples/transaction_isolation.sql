insert into db_task_runner.db_task_examples(key, title, "order", description_html)
values ('transaction_isolation', 'Что такое изоляция транзакций', 2000, '<p>
        <b>Изоляция транзакций &mdash;</b> специальный механизм в базах данных, который служит для того,
        чтобы несколько транзакций могли работать параллельно друг другу. Уровень изоляции описывает,
        как работают транзакции, изменяющие одни и те же данные.
    </p>
    <p>
        В Postgres есть такие уровни изоляции транзакций:
        <ol>
    <li><b>Read Uncommitted &mdash;</b> на самом деле то же самое, что Read Committed.</li>
    <li><b>Read Committed &mdash;</b> транзакция видит все изменения, закомиченные другими транзакциями. 
        Если между двумя одинаковыми SELECT закончится другая транзакция, то второй SELECT увидит её данные.</li>
    <li><b>Repeatable Read &mdash;</b> транзакция не видит новых закомиченных изменений.
    Она видит базу данных такой, которая была на момент её начала.
    Однако остаются некоторые нежелательные эффекты, зависящие от того, в каком порядке выполняются параллельные транзакции.</li>
    <li><b>Serializable &mdash;</b> транзакции выполняются так, как будто бы они выполнялись по очереди.
    Самый строгий уровень. Нежелательных эффектов не должно быть вообще.</li>
</ol>
    <p>
        Каждый следующий уровень более строг и допускает меньше аномалий.
        Однако, вместо того, чтобы происходили аномалии, транзакции в таких случаях просто падают с ошибкой
        и просят их повторить. 
    </p>
    <p>
        По умолчанию в Postgres выставлен уровень <b>Read Committed.</b> Хотя он допускает больше всего аномалий,
        для большинства задач его достаточно. Разберём на примере, как он работает.
        Транзакция видит любые данные из завершённых транзакций, работающих параллельно.
    </p>')
on conflict on constraint pk_db_task_examples
    do update
    set title            = excluded.title,
        "order"          = excluded."order",
        description_html = excluded.description_html;

with data(example_key, key, "order", description_html) as (values ('transaction_isolation', 'pre', 1,
                                                                   '<p>
        Сначала заготовим данные в таблице:
    </p>'),
                                                                  ('transaction_isolation', 'unrepeatable_read', 1,
                                                                   '<p>
        Первая аномалия называется <b>неповторяемое чтение.</b> Первая транзакция делает одну и ту же выборку данных несколько раз,
        и после завершения параллельных транзакций она начинает видеть их данные:
    </p>'))
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
         (values ('494198d8-47e6-4215-b85a-748f76010100'::uuid,
                  'transaction_isolation', 'pre', 1),
                 ('494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  'transaction_isolation', 'unrepeatable_read', 1),
                 ('494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  'transaction_isolation', 'unrepeatable_read', 2)),
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
         (values ('494198d8-47e6-4215-b85a-748f76010101'::uuid,
                  '494198d8-47e6-4215-b85a-748f76010100'::uuid,
                  1,
                  'NonQuery',
                  'truncate concurrency.big_data;',
                  '<span class="sql-keyword">truncate</span> <span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76010102'::uuid,
                  '494198d8-47e6-4215-b85a-748f76010100'::uuid,
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
                 ('494198d8-47e6-4215-b85a-748f76020101'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  1,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020102'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  2,
                  'Table',
                  'select *
from concurrency.big_data
order by id;',
                  '<span class="sql-keyword">select </span><span class="sql-other">*</span><br/>
    <span class="sql-keyword">from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span><br/>
    <span class="sql-keyword">order by id</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020103'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  3,
                  'Empty',
                  null,
                  null),
                 ('494198d8-47e6-4215-b85a-748f76020104'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  4,
                  'NonQuery',
                  'select pg_sleep(10);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">10</span><span class="sql-sign">);</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020105'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  5,
                  'Empty',
                  null,
                  null),
                 ('494198d8-47e6-4215-b85a-748f76020106'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  6,
                  'Table',
                  'select *
from concurrency.big_data
order by id;',
                  '<span class="sql-keyword">select </span><span class="sql-other">*</span><br/>
    <span class="sql-keyword">from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span><br/>
    <span class="sql-keyword">order by id</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020107'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  7,
                  'Empty',
                  null,
                  null),
                 ('494198d8-47e6-4215-b85a-748f76020108'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  8,
                  'NonQuery',
                  'select pg_sleep(10);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">10</span><span class="sql-sign">);</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020109'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  9,
                  'Empty',
                  null,
                  null),
                 ('494198d8-47e6-4215-b85a-748f76020110'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  10,
                  'Table',
                  'select *
from concurrency.big_data
order by id;',
                  '<span class="sql-keyword">select </span><span class="sql-other">*</span><br/>
    <span class="sql-keyword">from </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span><br/>
    <span class="sql-keyword">order by id</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020111'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020100'::uuid,
                  11,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020201'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  1,
                  'Empty',
                  null,
                  null),
                 ('494198d8-47e6-4215-b85a-748f76020202'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  2,
                  'NonQuery',
                  'select pg_sleep(5);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">5</span><span class="sql-sign">);</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020203'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  3,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020204'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  4,
                  'Table',
                  'update concurrency.big_data
set flag = true
where true
returning id, flag;',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span><br/>
    <span class="sql-keyword">set flag </span><span class="sql-sign">= </span><span class="sql-keyword">true</span><br/>
    <span class="sql-keyword">where true</span><br/>
    <span class="sql-keyword">returning id</span><span class="sql-sign">, </span><span class="sql-keyword">flag</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020205'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  5,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020206'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  6,
                  'NonQuery',
                  'select pg_sleep(10);',
                  '<span class="sql-keyword">select </span><span class="sql-function">pg_sleep</span><span class="sql-sign">(</span><span class="sql-number">10</span><span class="sql-sign">);</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020207'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  7,
                  'BeginTransaction',
                  null,
                  '<span class="sql-keyword">begin transaction</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020208'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  8,
                  'Table',
                  'update concurrency.big_data
set flag = false
where true
returning id, flag;',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">concurrency</span><span class="sql-sign">.</span><span class="sql-identifier">big_data</span><br/>
    <span class="sql-keyword">set flag </span><span class="sql-sign">= </span><span class="sql-keyword">false</span><br/>
    <span class="sql-keyword">where true</span><br/>
    <span class="sql-keyword">returning id</span><span class="sql-sign">, </span><span class="sql-keyword">flag</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020209'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  9,
                  'CommitTransaction',
                  null,
                  '<span class="sql-keyword">commit transaction</span><span class="sql-sign">;</span>'),
                 ('494198d8-47e6-4215-b85a-748f76020210'::uuid,
                  '494198d8-47e6-4215-b85a-748f76020200'::uuid,
                  10,
                  'Empty',
                  null,
                  null)),
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