drop database reactdb;

create database reactdb;

\c reactdb postgres

create table slide (
    slide_id serial PRIMARY KEY,
    slide_info text
);

create table question (
    question_id serial PRIMARY KEY,
    question_string text
);

create table option (
    option_id serial PRIMARY KEY,
    question_id serial REFERENCES question (question_id),
    option_string text
);

create table answer (
    question_id serial REFERENCES question (question_id),
    option_id serial REFERENCES option (option_id)
);