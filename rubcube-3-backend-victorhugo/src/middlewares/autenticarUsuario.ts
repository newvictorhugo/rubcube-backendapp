import { NextFunction } from "express";
import UsuarioModel from "models/UsuarioModel";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import UsuarioController from "controllers/UsuarioController";


type JWTPayLoad = {
    id: number
}
export const autenticarAuth = async(req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers
    const usuarioModel = new UsuarioModel()
    if(!authorization){
        return res.status(401).send({
            message: "Erro no login, tente novamente",
        })
    }
    try{
        const token = (authorization as string).split(' ')[1]
        const {id} = jwt.verify(token, process.env.SECRET_JWT || 'teste123') as JWTPayLoad
        const usuario = await usuarioModel.get(id)
        if(!usuario){
            return res.status(401).send({
                message: "Erro no login, tente novamente",
            })
        }else{
            if(usuario.usuario_id !== id){                                      //
                return res.status(401).send({                                   //
                    message: "Você não tem permissão para acessar esta rota."   //
                });                                                             //
            }
            Reflect.set(req.body, 'usuario_id', id);
        }
        console.log("PASSOU AUTENTICAR ID DO TOKEN")
        next()
        
    }catch(error){
        res.status(401).send({
            message: "Erro no login. tente novamente",
        })
    }

}