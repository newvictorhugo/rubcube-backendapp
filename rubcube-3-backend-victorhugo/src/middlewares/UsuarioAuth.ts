import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { UsuarioUtils } from '../utils/UsuarioUtils';
import { manipulaErros } from 'controllers/ErrorController';
import { Atributo, HTTP_Codes, Tabela } from 'dtos/errorDTO';

const adicionaErros = new manipulaErros()

export const validandoSenhaApp = (req: Request, res:Response, next: NextFunction) =>{
    const senhaSchema = Joi.object({
        usuario_senha: Joi.string().regex(UsuarioUtils.senhaappRegex).required(),
        usuario_senhanova: Joi.string().regex(UsuarioUtils.senhaappRegex).required(),
        usuario_senhanovaconfirm: Joi.string().regex(UsuarioUtils.senhaappRegex).required(),
        usuario_id: Joi.number().required(),
    })
    adicionaErros.clearErros()
    const senha = req.body;
    const resultado = senhaSchema.validate(senha, {abortEarly: false});
    console.log(resultado)
    if(resultado.error) {
        resultado.error.details.forEach((objUsuario)=>{
            if(objUsuario.path.includes('usuario_senha')){
                adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_senha, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de nome completo inválido'})
            }
            if(objUsuario.path.includes('usuario_senhanova')){
                adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_senhanova, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de nome completo inválido'})
            }
        })
        const listaErros = adicionaErros.getErros()
        return res.status(400).send({error: listaErros})
    }else{
        next()
    }

}

export const validandoUsuarioUpdate = (req: Request, res:Response, next: NextFunction) => {
    const usuarioSchema = Joi.object({
        usuario_nome: Joi.string().regex(UsuarioUtils.nomeRegex).required(),
        // usuario_email: Joi.string().regex(UsuarioUtils.emailRegex).required(),
        // usuario_senha: Joi.string().regex(UsuarioUtils.senhaappRegex).required(),
        usuario_tel: Joi.string().regex(UsuarioUtils.telRegex).required(),
    //     usuario_cpf: Joi.string().custom((usuario_cpf, helpers) => {
    //         if(!UsuarioUtils.validarCPF(usuario_cpf)){
    //             return helpers.error('400')
    //         }
    //         return usuario_cpf
    // }).required(),
        usuario_dtNascimento: Joi.custom((value, helpers) => {
            if(!UsuarioUtils.dataAniRegex.test(value)){
                return helpers.error('erro digitacao')
            }
            if(!UsuarioUtils.validarIdade(value)){
                return helpers.error('menor de idade')
            }
            return value
        }).required(), 
        usuario_id: Joi.number().required(),
    })
    adicionaErros.clearErros()
    const usuario = req.body;
    const resultado = usuarioSchema.validate(usuario, {abortEarly: false});
    console.log(resultado)
    if(resultado.error) {
        resultado.error.details.forEach((objUsuario)=>{
            if(objUsuario.path.includes('usuario_nome')){
                adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_nome, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de nome completo inválido'})
            }
            // if(objUsuario.path.includes('usuario_email')){
            //     adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_email, HTTP_Codes.BadRequest, '')
            //     // res.status(400).send({error: 'Formato de email inválido'})
            // }
            // if(objUsuario.path.includes('usuario_senha')){
            //     adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_senha, HTTP_Codes.BadRequest, '')
            //     // res.status(400).send({error: 'Formato de senha inválido, informe pelo menos 1 caracter especial, letra MAIUSCULA, minuscula e numero'})
            // }
            if(objUsuario.path.includes('usuario_tel')){
                adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_telefone, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de telefone inválido, deve existir o ddd do pais e estado (55189xxxxxxxx)'})
            }
            // if(objUsuario.path.includes('usuario_cpf')){
            //     adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_cpf, HTTP_Codes.BadRequest, '')
            //     // res.status(400).send({error: 'CPF não existe'})
            // }
            if(objUsuario.path.includes('usuario_dtNascimento')){
                if(objUsuario.type.includes('menor de idade')){
                    adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_dataNasc, HTTP_Codes.BadRequest, 'É necessário ser maior de 18 anos para criar uma conta')
                }
                if(objUsuario.type.includes('erro digitacao')){
                    adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_dataNasc, HTTP_Codes.BadRequest, '')
                }
                // res.status(400).send({error: 'Formato de data de nascimento inválido (2000-12-30) ou indivíduo menor de idade'})
            }
        })
        const listaErros = adicionaErros.getErros()
        return res.status(400).send({error: listaErros})
        // console.log(listaErros)
    }else{
        next()
    }

}

export const validandoUsuario = (req: Request, res:Response, next: NextFunction) => {
    const usuarioSchema = Joi.object({
        usuario_nome: Joi.string().regex(UsuarioUtils.nomeRegex).required(),
        usuario_email: Joi.string().regex(UsuarioUtils.emailRegex).required(),
        usuario_senha: Joi.string().regex(UsuarioUtils.senhaappRegex).required(),
        usuario_tel: Joi.string().regex(UsuarioUtils.telRegex).required(),
        usuario_cpf: Joi.string().custom((usuario_cpf, helpers) => {
            if(!UsuarioUtils.validarCPF(usuario_cpf)){
                return helpers.error('400')
            }
            return usuario_cpf
    }).required(),
        usuario_dtNascimento: Joi.custom((value, helpers) => {
            if(!UsuarioUtils.dataAniRegex.test(value)){
                return helpers.error('erro digitacao')
            }
            if(!UsuarioUtils.validarIdade(value)){
                return helpers.error('menor de idade')
            }
            return value
        }).required(), 
        
    })
    adicionaErros.clearErros()
    const usuario = req.body;
    const resultado = usuarioSchema.validate(usuario, {abortEarly: false});
    console.log(resultado)
    if(resultado.error) {
        resultado.error.details.forEach((objUsuario)=>{
            if(objUsuario.path.includes('usuario_nome')){
                adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_nome, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de nome completo inválido'})
            }
            if(objUsuario.path.includes('usuario_email')){
                adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_email, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de email inválido'})
            }
            if(objUsuario.path.includes('usuario_senha')){
                adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_senha, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de senha inválido, informe pelo menos 1 caracter especial, letra MAIUSCULA, minuscula e numero'})
            }
            if(objUsuario.path.includes('usuario_tel')){
                adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_telefone, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'Formato de telefone inválido, deve existir o ddd do pais e estado (55189xxxxxxxx)'})
            }
            if(objUsuario.path.includes('usuario_cpf')){
                adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_cpf, HTTP_Codes.BadRequest, '')
                // res.status(400).send({error: 'CPF não existe'})
            }
            if(objUsuario.path.includes('usuario_dtNascimento')){
                if(objUsuario.type.includes('menor de idade')){
                    adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_dataNasc, HTTP_Codes.BadRequest, 'É necessário ser maior de 18 anos para criar uma conta')
                }
                if(objUsuario.type.includes('erro digitacao')){
                    adicionaErros.adicionaErro(Tabela.Usuario , Atributo.usu_dataNasc, HTTP_Codes.BadRequest, '')
                }
                // res.status(400).send({error: 'Formato de data de nascimento inválido (2000-12-30) ou indivíduo menor de idade'})
            }
        })
        const listaErros = adicionaErros.getErros()
        return res.status(400).send({error: listaErros})
        // console.log(listaErros)
    }else{
        next()
    }

}

// export const validarUsuario = (req: Request, res:Response, next: NextFunction) => {
//     const payload = {
//         usuario_nome: req.body.usuario_nome,
//         usuario_email: req.body.usuario_email, 
//         usuario_senha: req.body.usuario_senha, 
//         usuario_tel: req.body.usuario_tel,
//         usuario_cpf: req.body.usuario_,
//         usuario_dtNascimento: req.body.usuario_nome
//     }
// }

