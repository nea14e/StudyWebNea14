create schema if not exists db_task_runner;

create table if not exists db_task_runner.db_task_examples
(
    key              varchar(20)
        constraint pk_db_task_examples PRIMARY KEY,
    description_html varchar NOT NULL
);

alter table db_task_runner.db_task_examples
    add column if not exists title varchar;

alter table db_task_runner.db_task_examples
    add column if not exists "order" int;

create table if not exists db_task_runner.db_task_snippets
(
    example_key      varchar(20) NOT NULL
        constraint fk_db_task_snippets_example_key references db_task_runner.db_task_examples (key),
    key              varchar(20) NOT NULL,
    "order"          int         NOT NULL,
    description_html varchar,
    is_deleted       bool        NOT NULL default (false),
    constraint pk_db_task_snippets PRIMARY KEY (example_key, key)
);

create table if not exists db_task_runner.db_task_processes
(
    id             uuid
        constraint pk_db_task_processes PRIMARY KEY,
    example_key    varchar(20) NOT NULL,
    snippet_key    varchar(20) NOT NULL,
    process_number int         NOT NULL,
    is_deleted     bool        NOT NULL DEFAULT (false),
    constraint fk_db_task_processes_example_key_snippet_key foreign key (example_key, snippet_key) references db_task_runner.db_task_snippets (example_key, key)
);

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
               ('BeginTransaction', 'Table', 'Scalar', 'NonQuery', 'CommitTransaction', 'RollbackTransaction')),
    constraint ch_db_task_items_type_sql
        check (
            ("type" in ('Table', 'Scalar', 'NonQuery') and sql is not null)
                or ("type" not in ('Table', 'Scalar', 'NonQuery') and sql is null)
            )
);

create unique index uq_db_task_items
    on db_task_runner.db_task_items (process_id, "order")
    where is_deleted = false;