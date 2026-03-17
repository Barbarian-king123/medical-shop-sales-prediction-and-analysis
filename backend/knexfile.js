module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'Jose1234',
      database: 'miniProject'
    },
    migrations: {
      directory: './migrations'
    }
  }
};