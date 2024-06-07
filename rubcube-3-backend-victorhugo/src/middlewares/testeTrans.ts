import { Request, Response, NextFunction } from 'express';
import Joi, { func } from 'joi';
import { TransferenciaUtils } from 'utils/TransferenciaAuth'; 

    const transDescricaoRegex: RegExp = /^[A-Za-z0-9!#$@%*()\/°&-+='"|,.;:]{0,100}.*$/
    const transStatusRegex: RegExp = /^\w.*$/
    const transMetodoRegex: RegExp = /^\w.*$/

    function validarSaldo(id: any, id2: any){
        
    }
    const transferenciaSchema = Joi.object({
        usuId_remetente: Joi.number().required(),
        usuId_destinatario: Joi.number().required(),
        trans_valor: Joi.number().required(),
        trans_descricao: Joi.string().regex(transDescricaoRegex).required(),
        trans_status: Joi.string().regex(transStatusRegex).required(),
        trans_metodo: Joi.string().regex(transMetodoRegex).required()
    })
    console.log()

    const conta1 = {
        conta_id: 1,
        conta_saldo: 0
    }
    const conta2 = {
        conta_id: 2,
        conta_saldo: 0
    }

    const trans = {
        usuId_remetente: conta1.conta_id,
        usuId_destinatario: conta2.conta_id,
        trans_valor: 100,
        trans_descricao: "string",
        trans_status: "string",
        trans_metodo: "string",
      };
    const resultado = transferenciaSchema.validate(trans)
    if(resultado.error) {
        console.log(resultado.error.details)
    }else{
      console.log(trans)
    }
