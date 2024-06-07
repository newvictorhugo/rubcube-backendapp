import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { TransferenciaUtils } from 'utils/TransferenciaAuth';
import ContaBancariaModel from 'models/ContaBancariaModel';
import { PrismaClient } from '@prisma/client';
import { manipulaErros } from 'controllers/ErrorController';
import { Atributo, HTTP_Codes, Tabela } from 'dtos/errorDTO';

const adicionaErros = new manipulaErros()
const prisma = new PrismaClient()
const contaBancariaModel = new ContaBancariaModel()

export async function validandoSenhaTransferencia (req: Request, res:Response, next: NextFunction) {

    const usuId_remetente = Reflect.get(req.body, 'usuario_id')
    const {contaBanc_senhatransacao} = req.body
    const contaBanc = await contaBancariaModel.getAccountByUserId(usuId_remetente);
    // const contaRemetente = await prisma.contaBancaria.findUnique({where: {contaBanc_id: usuId_remetente}})
    adicionaErros.clearErros()
    if(contaBanc_senhatransacao != contaBanc?.contaBanc_senhatransacao){
        adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.contaBanc_senhatransacao, HTTP_Codes.BadRequest, '')
    }
    console.log("PASSOU VALIDACAO DE SENHA DE TRANSFERENCIA")
    next()
}

export async function validandoSaldoTransferencia (req: Request, res:Response, next: NextFunction) {

    const usuId_remetente = Reflect.get(req.body, 'usuario_id')
    const {trans_valor} = req.body
    // const usuId_remetente = Number(req.params.id)
    //const remetente = await prisma.usuario.findUnique({where: {usuario_id: usuId_remetente}, include: {conta: true}})
    const contaRemetente = await contaBancariaModel.getAccountByUserId(usuId_remetente);
    if(contaRemetente!.contaBanc_saldo < trans_valor){
        adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.contaBanc_saldo, HTTP_Codes.NotFound, 'Saldo insuficiente')
    }
    if(trans_valor <= 0){
        adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.contaBanc_saldo, HTTP_Codes.NotFound, 'Valor inválido')
    }
    const listaErros = adicionaErros.getErros()
    if(listaErros.length > 0){
        return res.status(400).send({error: listaErros})
    }else{
        console.log("PASSOU VALIDACAO DE SALDO")
        next()
    }
}

export async function validandoIdTransferencia (req: Request, res:Response, next: NextFunction) {

    const usuId_remetente = Reflect.get(req.body, 'usuario_id')
    const conta = await contaBancariaModel.getAccountByUserId(usuId_remetente);
    if(req.body.usuId_destinatario){
        const destinatario_cpf: string = req.body.usuId_destinatario
        const pegaIdConta : any | null = await contaBancariaModel.getContaCpf(destinatario_cpf)
        if(pegaIdConta == null){
            adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.usu_cpf, HTTP_Codes.BadRequest, '')
            // return res.status(400).send({error: 'Conta destino inexistente'})
        }else{
            const { contaBanc_id } = pegaIdConta;
            if(conta?.contaBanc_id == contaBanc_id){
                adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.usu_cpf, HTTP_Codes.BadRequest, 'Não é possível transferir para a sua mesma conta')
            }
        }
    }
    if(req.body.contaBanc_agencia && req.body.contaBanc_conta){
        const {contaBanc_agencia, contaBanc_conta} = req.body
        const pegaIdConta = await contaBancariaModel.getContaPorNum(contaBanc_conta, contaBanc_agencia)
        if(pegaIdConta){
            if(conta?.contaBanc_id == pegaIdConta.contaBanc_id){
                adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.contaBanc_conta, HTTP_Codes.BadRequest, 'Não é possível transferir para a sua mesma conta')
            }
        }else{
            adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.contaBanc_conta, HTTP_Codes.BadRequest, '')
            adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.contaBanc_agencia, HTTP_Codes.BadRequest, '')
        }
    }
    console.log("PASSOU VALIDACAO ID")
    next()
}

export const validandoTransferencia = (req: Request, res:Response, next: NextFunction) => {
    
    const transferenciaSchema = Joi.object({
        // usuId_remetente: Joi.number().required(),
        contaBanc_agencia: Joi.number().when('usuId_destinatario', {
            is: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.required()
        }),
        contaBanc_conta: Joi.string().when('usuId_destinatario', {
            is: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.required()
        }),
        usuId_destinatario: Joi.number().when(Joi.object({
            contaBanc_agencia: Joi.exist(),
            contaBanc_conta: Joi.exist()
        }).unknown(), {
            then: Joi.forbidden(),
            otherwise: Joi.required()
        }),
        trans_valor: Joi.number().required(),
        trans_descricao: Joi.string().regex(TransferenciaUtils.transDescricaoRegex).optional().allow(''),
        // trans_status: Joi.string().regex(TransferenciaUtils.transStatusRegex).required(),
        trans_metodo: Joi.string().regex(TransferenciaUtils.transMetodoRegex).required(),
        contaBanc_senhatransacao: Joi.string().required(),
        usuario_id: Joi.number().required()
    })
    adicionaErros.clearErros()
    const transferencia = req.body;
    const resultado = transferenciaSchema.validate(transferencia, {abortEarly: false});
    if(resultado.error) {
        resultado.error.details.forEach((objTransferencia)=>{
            // if(objTransferencia.path.includes('usuId_remetente')){
            //     res.status(400).send({error: 'Formato de id remetente inválido'})
            // }
            if(objTransferencia.path.includes('usuId_destinatario')){
                adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.usuId_destinatario, HTTP_Codes.BadRequest, '')
                // return res.status(400).send({error: 'Formato de id destinatario inválido'})
            }
            if(objTransferencia.path.includes('contaBanc_agencia')){
                adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.contaBanc_agencia, HTTP_Codes.BadRequest, '')
            }
            if(objTransferencia.path.includes('contaBanc_conta')){
                adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.contaBanc_conta, HTTP_Codes.BadRequest, '')
            }
            if(objTransferencia.path.includes('trans_valor')){
                adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.trans_valor, HTTP_Codes.BadRequest, '')
                // return res.status(400).send({error: 'Formato de valor inválido'})
            }
            if(objTransferencia.path.includes('trans_descricao')){
                adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.trans_descricao, HTTP_Codes.BadRequest, '')
                // return res.status(400).send({error: 'Formato de descricao inválido'})
            }
            // if(objTransferencia.path.includes('trans_status')){
            //     adicionaErros.adicionaErro(Tabela.Conta, Atributo.contaBanc_senhaTrans, HTTP_Codes.BadRequest, '')
            //     // return res.status(400).send({error: 'Formato de status inválido'})
            // }
            if(objTransferencia.path.includes('trans_metodo')){
                adicionaErros.adicionaErro(Tabela.Transferencia, Atributo.trans_metodo, HTTP_Codes.BadRequest, '')
                // return res.status(400).send({error: 'Formato de metodo inválido'})
            }
            // if(objTransferencia.path.includes('usuario_id')){
            //     delete transferencia[objTransferencia.context?.key]
            // }
        })
        const listaErros = adicionaErros.getErros()
        console.log(resultado.error.details)
        return res.status(400).send({error: listaErros})
    }else{
        console.log("PASSOU VALIDACAO DIGITACAO")
        next()
    }


}
