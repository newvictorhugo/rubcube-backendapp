import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { EnderecoUtils } from '../utils/EnderecoUtils'; 
import { manipulaErros } from 'controllers/ErrorController';
import { Atributo, HTTP_Codes, Tabela } from 'dtos/errorDTO';

const adicionaErros = new manipulaErros()


export const validandoEndereco = (req: Request, res:Response, next: NextFunction) => {
    const enderecoSchema = Joi.object({
        end_cep: Joi.string().regex(EnderecoUtils.cepRegex).required(),
        end_rua: Joi.string().regex(EnderecoUtils.ruaRegex).required(),
        end_num: Joi.string().regex(EnderecoUtils.numRegex).required(),
        end_complem: Joi.string().regex(EnderecoUtils.bairroComplemRegex).optional().allow(''),
        end_bairro: Joi.string().regex(EnderecoUtils.bairroComplemRegex).required(),
        end_cidade: Joi.string().regex(EnderecoUtils.cidadeRegex).required(),
        end_uf: Joi.string().regex(EnderecoUtils.ufRegex).required(),
        usuario_id: Joi.number()
    })
    adicionaErros.clearErros()
    const endereco = req.body;
    const resultado = enderecoSchema.validate(endereco, {abortEarly: false});
    if(resultado.error) {
        resultado.error.details.forEach((objEndereco)=>{
            if(objEndereco.path.includes('end_cep')){
                adicionaErros.adicionaErro(Tabela.Endereco, Atributo.end_cep, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de CEP inválido'})
            }
            if(objEndereco.path.includes('end_rua')){
                adicionaErros.adicionaErro(Tabela.Endereco, Atributo.end_rua, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de RUA inválido'})
            }
            if(objEndereco.path.includes('end_num')){
                adicionaErros.adicionaErro(Tabela.Endereco, Atributo.end_num, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de NUMERO inválido'})
            }
            if(objEndereco.path.includes('end_complem')){
                adicionaErros.adicionaErro(Tabela.Endereco, Atributo.end_complem, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de COMPLEMENTO inválido'})
            }
            if(objEndereco.path.includes('end_bairro')){
                adicionaErros.adicionaErro(Tabela.Endereco, Atributo.end_bairro, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de BAIRRO inválido'})
            }
            if(objEndereco.path.includes('end_cidade')){
                adicionaErros.adicionaErro(Tabela.Endereco, Atributo.end_cidade, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de CIDADE inválido'})
            }
            if(objEndereco.path.includes('end_uf')){
                adicionaErros.adicionaErro(Tabela.Endereco , Atributo.end_uf, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de UF inválido'})
            }
        })
        const listaErros = adicionaErros.getErros()
        return res.status(400).send({error: listaErros})
    }else{
        next()
        return
    }

}
