const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';
const client = new pg.Client(connectionString);

client.connect();
const query = client.query(
  'create table product(id_product int, id_seller int, name varchar(30), description varchar, precio_unitario numeric(5,2),stock int, image varchar,delivery_date timestamp, limit_date date, register_date date, id_category int)');
query.on('end', () => { client.end(); });
