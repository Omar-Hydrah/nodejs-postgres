create extension if not exists "uuid-ossp";

create table groups(
  group_id uuid default uuid_generate_v4(),
  group_name varchar not null,
  group_description varchar,
  primary key (group_id)
);

create table users(
  user_id uuid default uuid_generate_v4(),
  account_id uuid default uuid_generate_v4(),
  first_name varchar,
  last_name varchar,
  email varchar not null,
  group_id uuid not null,
  primary key (user_id),
  constraint fk_group
  foreign key(group_id)
  references groups(group_id)
);

insert into groups(group_name) values
('Support Agents'),
('Bot Builders'),
('Bot Admins');
