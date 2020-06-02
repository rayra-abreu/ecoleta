import knex from 'knex'
import path from 'path'

const connection=knex({
  client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'database.sqlite') /*Padronizando o 
      caminho conforme o sistema operacional*/
    },
    useNullAsDefault: true,
})

export default connection
//Migrations = Histórico do banco de dados