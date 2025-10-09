insert into db_task_runner.db_task_examples(key, description_html)
values ('no_order_pagination', '<p>Если вы забудете ORDER BY в выражении SELECT с пагинацией, ' ||
                               'то БД будет сортировать данные как ей угодно или не будет сортировать вообще. ' ||
                               'В последнем случае это означает, что <b>данные будут выдаваться в том порядке, ' ||
                               'как они физически лежат в БД.</b></p>')
on conflict on constraint pk_db_task_examples
    do update
    set description_html = excluded.description_html;

with data(example_key, key, "order", description_html) as (values ('no_order_pagination', 'generate_data', 1,
                                                                   '<p>Этот эффект особенно заметен, когда данных в БД чуть больше, ' ||
                                                                   'чем помещается на одной странице (хотя он может проявиться с любыми данными). ' ||
                                                                   'Сгенерируем их:</p>'),
                                                                  ('no_order_pagination', 'select_before', 2,
                                                                   '<p>Сначала всё вроде бы хорошо:</p>'),
                                                                  ('no_order_pagination', 'update', 3,
                                                                   '<p>Когда пользователь заходит на страницу редактирования, ' ||
                                                                   'он изменяет записи. При этом их физический порядок в БД меняется, меняется и выдача.</p>' ||
                                                                   '<p>Для примера, изменим несколько записей:</p>'),
                                                                  ('no_order_pagination', 'select_after', 4,
                                                                   '<p>Посмотрим, как меняется выдача:</p>'))
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
         (values ('5119a44a-ddf0-49c0-99d6-b5d30e150100'::uuid,
                  'no_order_pagination', 'generate_data', 1),
                 ('83fa943f-7451-4179-baec-125a6e2a0100'::uuid,
                  'no_order_pagination', 'select_before', 1),
                 ('6867378c-696f-4da7-b86f-0104c4450100'::uuid,
                  'no_order_pagination', 'update', 1),
                 ('ba4de01d-6ac8-46c1-a72f-b626d9160100'::uuid,
                  'no_order_pagination', 'select_after', 1)),
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
         (values ('5119a44a-ddf0-49c0-99d6-b5d30e150101'::uuid,
                  '5119a44a-ddf0-49c0-99d6-b5d30e150100'::uuid,
                  1,
                  'NonQuery',
                  'truncate public.pagination;',
                  '<span class="sql-keyword">truncate</span> <span class="sql-identifier">public</span><span class="sql-sign">.</span><span class="sql-identifier">pagination</span><span class="sql-sign">;</span>'),
                 ('5119a44a-ddf0-49c0-99d6-b5d30e150102'::uuid,
                  '5119a44a-ddf0-49c0-99d6-b5d30e150100'::uuid,
                  2,
                  'NonQuery',
                  'insert into public.pagination(id, data)
select ser.i, random()
from generate_series(1, 11) ser(i);',
                  '<span class="sql-keyword">insert into </span>
                  <span class="sql-identifier">public</span><span class="sql-sign">.</span><span class="sql-identifier">pagination</span>
                  <span class="sql-sign">(</span><span class="sql-keyword">id</span><span class="sql-sign">, </span><span class="sql-keyword">data</span><span class="sql-sign">)</span><br/>
                  <span class="sql-keyword">select ser</span><span class="sql-sign">.</span><span class="sql-keyword">i</span><span class="sql-sign">, </span>
                  <span class="sql-function">random</span><span class="sql-other">()</span><br/>
                  <span class="sql-keyword">from </span><span class="sql-function">generate_series</span><span class="sql-other">(</span><span class="sql-number">1</span><span class="sql-sign">, </span><span class="sql-number">11</span><span class="sql-other">) </span>
                  <span class="sql-keyword">ser</span><span class="sql-other">(</span><span class="sql-keyword">i</span><span class="sql-other">)</span><span class="sql-sign">;</span>'),
                 ('83fa943f-7451-4179-baec-125a6e2a0101'::uuid,
                  '83fa943f-7451-4179-baec-125a6e2a0100'::uuid,
                  1,
                  'Table',
                  'select *
   from public.pagination
   limit 10 offset 0;',
                  '<span class="sql-keyword">select </span><span class="sql-other">*</span><br/>' ||
                  '<span class="sql-keyword">from </span><span class="sql-identifier">public</span><span class="sql-sign">.</span><span class="sql-identifier">pagination</span><br/>' ||
                  '<span class="sql-keyword">limit </span><span class="sql-number">10 </span><span class="sql-keyword">offset </span><span class="sql-number">0</span><span class="sql-sign">;</span>'),
                 ('6867378c-696f-4da7-b86f-0104c4450101'::uuid,
                  '6867378c-696f-4da7-b86f-0104c4450100'::uuid,
                  1,
                  'NonQuery',
                  'update public.pagination
   set last_updated = now()
   where id = random(1, 11);',
                  '<span class="sql-keyword">update </span><span class="sql-identifier">public</span><span class="sql-sign">.</span><span class="sql-identifier">pagination</span><br/>' ||
                  '<span class="sql-keyword">set last_updated</span><span class="sql-sign"> = </span><span class="sql-function">now</span><span class="sql-other">()</span><br/>' ||
                  '<span class="sql-keyword">where id</span><span class="sql-sign"> = </span><span class="sql-function">random</span>' ||
                  '<span class="sql-other">(</span><span class="sql-number">1</span><span class="sql-sign">, </span><span class="sql-number">11</span><span class="sql-other">)</span><span class="sql-sign">;</span>'),
                 ('ba4de01d-6ac8-46c1-a72f-b626d9160101'::uuid,
                  'ba4de01d-6ac8-46c1-a72f-b626d9160100'::uuid,
                  1,
                  'Table',
                  'select *
   from public.pagination
   limit 10 offset 0;',
                  '<span class="sql-keyword">select </span><span class="sql-other">*</span><br/>' ||
                  '<span class="sql-keyword">from </span><span class="sql-identifier">public</span><span class="sql-sign">.</span><span class="sql-identifier">pagination</span><br/>' ||
                  '<span class="sql-keyword">limit </span><span class="sql-number">10 </span><span class="sql-keyword">offset </span><span class="sql-number">0</span><span class="sql-sign">;</span>'),
                 ('ba4de01d-6ac8-46c1-a72f-b626d9160102'::uuid,
                  'ba4de01d-6ac8-46c1-a72f-b626d9160100'::uuid,
                  2,
                  'Table',
                  'select *
   from public.pagination
   limit 10 offset 10;',
                  '<span class="sql-keyword">select </span><span class="sql-other">*</span><br/>' ||
                  '<span class="sql-keyword">from </span><span class="sql-identifier">public</span><span class="sql-sign">.</span><span class="sql-identifier">pagination</span><br/>' ||
                  '<span class="sql-keyword">limit </span><span class="sql-number">10 </span><span class="sql-keyword">offset </span><span class="sql-number">10</span><span class="sql-sign">;</span>')),
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