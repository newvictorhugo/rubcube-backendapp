import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ContaUtils } from 'utils/ContaUtils'; 
import { manipulaErros } from 'controllers/ErrorController';
import { Atributo, HTTP_Codes, Tabela } from 'dtos/errorDTO';

const adicionaErros = new manipulaErros()
const prisma = new PrismaClient()

export const criandoNumConta = (req: Request, res:Response, next: NextFunction) => {
    
    const usuario_id = Reflect.get(req.body, 'usuario_id')
    const {contaBanc_tipo} = req.body
    if(contaBanc_tipo == 'poupanca'){
        const numConta = '02' + '00' + usuario_id
        Reflect.set(req.body, "contaBanc_conta", numConta)
    }
    if(contaBanc_tipo == 'corrente'){
        const numConta = '03' + '00' + usuario_id
        Reflect.set(req.body, "contaBanc_conta", numConta)
    }if(contaBanc_tipo != 'corrente' && contaBanc_tipo != 'poupanca'){
        adicionaErros.adicionaErro(Tabela.Conta, Atributo.contaBanc_tipo, HTTP_Codes.BadRequest, '')
        const listaErros = adicionaErros.getErros()
        return res.status(400).send({error: listaErros})

    }
    next()
}



export const validandoSenhaTrans = (req: Request, res:Response, next: NextFunction) =>{
    const senhaSchema = Joi.object({
        contaBanc_senhatransacao: Joi.custom((senhaTransacao, helpers)=>{
            if(!ContaUtils.validarSenhaTrans(senhaTransacao)){
                return helpers.error('400')
            }
            return senhaTransacao
        }).required(),
        contaBanc_senhatransacaonova: Joi.custom((senhaTransacao, helpers)=>{
            if(!ContaUtils.validarSenhaTrans(senhaTransacao)){
                return helpers.error('400')
            }
            return senhaTransacao
        }).required(),
        contaBanc_senhatransacaonovaconfirm: Joi.string().required(),
        usuario_id: Joi.number().required(),
    })
    adicionaErros.clearErros()
    const senha = req.body;
    const resultado = senhaSchema.validate(senha, {abortEarly: false});
    console.log(resultado)
    if(resultado.error) {
        resultado.error.details.forEach((objUsuario)=>{
            if(objUsuario.path.includes('contaBanc_senhatransacao')){
                adicionaErros.adicionaErro(Tabela.Conta , Atributo.contaBanc_senhatransacao, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de nome completo inválido'})
            }
            if(objUsuario.path.includes('contaBanc_senhatransacaonova')){
                adicionaErros.adicionaErro(Tabela.Conta , Atributo.contaBanc_senhatransacaonova, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de nome completo inválido'})
            }
        })
        const listaErros = adicionaErros.getErros()
        return res.status(400).send({error: listaErros})
    }else{
        next()
    }

}

export const validandoContaBanc = (req: Request, res:Response, next: NextFunction) => {
    const contaSchema = Joi.object({
        // contaBanc_agencia: Joi.number().required(),
        //contaBanc_conta: Joi.string().regex(ContaUtils.contaBanc_conta).required(),
        contaBanc_senhatransacao: Joi.custom((senhaTransacao, helpers)=>{
            if(!ContaUtils.validarSenhaTrans(senhaTransacao)){
                return helpers.error('400')
            }
            return senhaTransacao
        }).required(),//.regex(ContaUtils.contaBanc_senhatran).required(),
        contaBanc_tipo: Joi.string().regex(ContaUtils.contaBanc_tipo).required(),
        // contaBanc_saldo: Joi.number().required(),
        // contaBanc_status: Joi.string().regex(ContaUtils.contaBanc_status).required(),
        usuario_id: Joi.number().required()
    })
    adicionaErros.clearErros()
    const conta = req.body;
    const resultado = contaSchema.validate(conta, {abortEarly: false});
    if(resultado.error) {
        resultado.error.details.forEach((objConta)=>{
            // if(objConta.path.includes('contaBanc_agencia')){
            //     res.status(400).send({error: 'Formato de agencia inválido'})
            // }
            // if(objConta.path.includes('contaBanc_conta')){
                // res.status(400).send({error: 'Formato de conta inválido'})
            // }
            if(objConta.path.includes('contaBanc_senhatransacao')){
                adicionaErros.adicionaErro(Tabela.Conta, Atributo.contaBanc_senhatransacao, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de senha inválido'})
            }
            if(objConta.path.includes('contaBanc_tipo')){
                adicionaErros.adicionaErro(Tabela.Conta, Atributo.contaBanc_tipo, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de tipo inválido'})
            }
            // if(objConta.path.includes('contaBanc_saldo')){
            //     res.status(400).send({error: 'Formato de saldo inválido'})
            // }
            // if(objConta.path.includes('contaBanc_status')){
            //     res.status(400).send({error: 'Formato de status inválido'})
            // }
            // if(objConta.path.includes('usuario_id')){
                // res.status(400).send({error: 'ID de usuário inexistente'})
            // }
        })
        const listaErros = adicionaErros.getErros()
        return res.status(400).send({error: listaErros})
    }
    next()

}



