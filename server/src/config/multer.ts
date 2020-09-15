import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

export default{
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(request, file, callback){
      const hash=crypto.randomBytes(6).toString('hex')

      const fileName=`${hash}-${file.originalname}`

      callback(null, fileName)
    },
  }),
  
  fileFilter: (req: any, file: any, cb: any)=> {
    const acceptedImage = [
      'image/png', 
      'image/jpg', 
      'image/jpeg'].some( checkType => checkType == file.mimetype )

    if(acceptedImage){
      return cb(null, true)
    }

    cb(new Error("Arquivo inválido!"))
  }
}