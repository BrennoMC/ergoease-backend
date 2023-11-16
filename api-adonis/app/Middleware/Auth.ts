import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'

export default class Auth {
  public async handle(
    {request, response, params}: HttpContextContract, 
    next: () => Promise<void>) {
      const respToken = request.header('Authorization')
      const token = respToken!.split(" ")
      const senha = Env.get('JWT_PASSWORD')
      jwt.verify(token[1],senha,undefined,(error,decoded)=>{
        if (error){
          response.unauthorized()
        }
        console.log(decoded)
        params.userData = decoded
      }) 
      await next()
  }
}
