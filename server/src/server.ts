import express from 'express'
import path from 'path'
import routes from './routes'

const app=express()
app.use(express.json()) /*O use server para colocar como se fosse uma 
funcionalidade a mais no express, essa funcionalidade é a forma do express 
entender o corpo da requisição*/

//Rota: endereço completo da requisição
//Recurso: qual entidade estamos acessando do sistema
//Request Param: Parâmetros que vem na própria rota que identificam um recurso
/*Query Param: Parâmetros que vem na própria rota geralmente opcionais para 
filtros, paginação*/
//Request Body: Parâmetros para criação/ atualização de informações

//SELECT * FROM users WHERE name='Diego'
//knex('users').where('name', 'Diego').select('*')

/*
const users=[
  'Diego',
  'Cleiton',
  'Usuário'
]

app.get('/users', (request, response)=>{
  const search=String(request.query.search)
  console.log(search)

  const filteredUsers=search ? users.filter(user=>user.includes(search)) : users

  response.json(filteredUsers)
})

app.get('/users/:id', (request, response)=>{
  const id=Number(request.params.id)
  const user=users[id]

  return response.json(user)
})

app.post('/users', (request, response)=>{
  const data=request.body

  const user={
    name: data.name,
    email: data.email
  }
  return response.json(user)
})*/

app.use(routes)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))
app.listen(3333)