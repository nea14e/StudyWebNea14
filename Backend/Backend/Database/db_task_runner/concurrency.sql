create schema if not exists concurrency;

create table if not exists concurrency.data
(
    id      int
        CONSTRAINT pk_concurrency_data PRIMARY KEY,
    "value" varchar
);

insert into concurrency.data
values (1, null),
       (2, null),
       (3, null),
       (4, null)
on conflict on constraint pk_concurrency_data do nothing;