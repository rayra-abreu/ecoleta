import express from 'express'
import {celebrate, Joi} from 'celebrate'
import multer from 'multer'
import multerConfig from './config/multer'

import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'

/*Padrão da comunidade: index(listagem), show(exibir um único registro daquele,
create(store), update, delete(ou destroy))*/
const routes=express.Router()
const upload=multer(multerConfig)
const pointsController=new PointsController()
const itemsController=new ItemsController()

routes.get('/items', itemsController.index)
routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)
/*.single(para envio de única foto) */
routes.post('/points', upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required()
    })
  }, {
    abortEarly: false
  }),
  pointsController.create
)

export default routes

//Service Pattern
//Repository Pattern(Data Mapper)