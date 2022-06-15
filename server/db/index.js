// const { Pool } = require('pg');
import pkg from 'pg';
const { Pool } = pkg;
// require('dotenv').config();

const pool = new Pool({
  user: process.env.USER,
  database: 'sdc',
  password: process.env.PASSWORD
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}
export async function getClient() {
  const client = await pool.connect();
  console.log('Connected');
  const query = client.query;
  const release = client.release;
  // const timeout = setTimeout(() => {
  //   console.error('A client has been checked out for more than 5 seconds!');
  //   console.error(
  //     `The last executed query on this client was: ${client.lastQuery}`
  //   );
  // }, 5000);
  // client.query = (...args: Array) => {
  //   client.lastQuery = args;
  //   return query.apply(client, args);
  // };
  client.release = () => {
    // clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  return client;
}
