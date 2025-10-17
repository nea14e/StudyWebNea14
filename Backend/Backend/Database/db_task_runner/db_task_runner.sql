create schema if not exists db_task_runner;

create table if not exists db_task_runner.db_task_examples
(
    key varchar(100)
        constraint pk_db_task_examples PRIMARY KEY,
    description_html varchar NOT NULL
);

alter table db_task_runner.db_task_examples
    add column if not exists title varchar;

alter table db_task_runner.db_task_examples
    add column if not exists "order" int;

alter table db_task_runner.db_task_examples
    alter column key type varchar(100); 

create table if not exists db_task_runner.db_task_snippets
(
    example_key varchar(100) NOT NULL
        constraint fk_db_task_snippets_example_key references db_task_runner.db_task_examples (key),
    key         varchar(100) NOT NULL,
    "order"          int         NOT NULL,
    description_html varchar,
    is_deleted       bool        NOT NULL default (false),
    constraint pk_db_task_snippets PRIMARY KEY (example_key, key)
);

alter table db_task_runner.db_task_snippets
    alter column example_key type varchar(100);
alter table db_task_runner.db_task_snippets
    alter column key type varchar(100);

create table if not exists db_task_runner.db_task_processes
(
    id             uuid
        constraint pk_db_task_processes PRIMARY KEY,
    example_key varchar(100) NOT NULL,
    snippet_key varchar(100) NOT NULL,
    process_number int         NOT NULL,
    is_deleted     bool        NOT NULL DEFAULT (false),
    constraint fk_db_task_processes_example_key_snippet_key foreign key (example_key, snippet_key) references db_task_runner.db_task_snippets (example_key, key)
);

alter table db_task_runner.db_task_processes
    alter column example_key type varchar(100);
alter table db_task_runner.db_task_processes
    alter column snippet_key type varchar(100);

create unique index uq_db_task_processes
    on db_task_runner.db_task_processes (example_key, snippet_key, process_number)
    where is_deleted = false;

create table if not exists db_task_runner.db_task_items
(
    id            uuid
        constraint pk_db_task_items PRIMARY KEY,
    process_id    uuid        NOT NULL
        constraint fk_db_task_items_process_id references db_task_runner.db_task_processes (id),
    "order"       int         NOT NULL,
    "type"        varchar(20) NOT NULL,
    sql           varchar,
    frontend_html varchar     NOT NULL,
    is_deleted    bool default (false),
    constraint ch_db_task_items_type
        check ("type" in
               ('BeginTransaction', 'Table', 'Scalar', 'NonQuery', 'CommitTransaction', 'RollbackTransaction',
                'Empty')),
    constraint ch_db_task_items_type_sql
        check (
            ("type" in ('Table', 'Scalar', 'NonQuery') and sql is not null)
                or ("type" in ('BeginTransaction', 'CommitTransaction', 'RollbackTransaction', 'Empty') and sql is null)
            )
);

create unique index uq_db_task_items
    on db_task_runner.db_task_items (process_id, "order")
    where is_deleted = false;

alter table db_task_runner.db_task_items
    drop constraint ch_db_task_items_type;
alter table db_task_runner.db_task_items
    add constraint ch_db_task_items_type check ("type" in
                                                ('BeginTransaction', 'Table', 'Scalar', 'NonQuery', 'CommitTransaction',
                                                 'RollbackTransaction', 'Empty'));

alter table db_task_runner.db_task_items
    drop constraint ch_db_task_items_type_sql;
alter table db_task_runner.db_task_items
    add constraint ch_db_task_items_type_sql
        check (
            ("type" in ('Table', 'Scalar', 'NonQuery') and sql is not null)
                or ("type" in ('BeginTransaction', 'CommitTransaction', 'RollbackTransaction', 'Empty') and sql is null)
            );

alter table db_task_runner.db_task_items
    alter column frontend_html drop not null;