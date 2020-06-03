import express from 'express'

import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'

/*Padrão da comunidade: index(listagem), show(exibir um único registro daquele,
create(store), update, delete(ou destroy))*/
const routes=express.Router()
const pointsController=new PointsController()
const itemsController=new ItemsController()

routes.get('/items', itemsController.index)
routes.post('/points', pointsController.create)
routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

export default routes

//Service Pattern
//Repository Pattern(Data Mapper)