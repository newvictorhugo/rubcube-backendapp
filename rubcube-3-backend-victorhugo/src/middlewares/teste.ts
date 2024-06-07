import { Request, Response, NextFunction } from 'express';
import Joi, { func } from 'joi';
import { stringify } from 'querystring';
import { ContaUtils } from 'utils/ContaUtils'; 

const contaBanc_agencia: RegExp = /^\d{3}$/
const contaBanc_conta: RegExp = /^\d{8}$/
const contaBanc_senhatran: RegExp = /^\d{4}$/
const contaBanc_tipo: RegExp = /^[A-Za-z].*$/
const contaBanc_saldo: RegExp = /^\d.*$/
const contaBanc_status: RegExp = /^[A-Za-z].*$/


function validarsenha(senha: any): boolean {
  return contaBanc_senhatran.test(senha)
}

function validarSenhaTrans(senha: any){

  if(validarsenha(senha)){
      const numeros = senha.split("")
      let cont = 0
      for(let i=0;i<numeros.length;i++){
          const numerosSenha = parseInt(numeros[i])
          if(numerosSenha-1 == parseInt(numeros[i-1])){
              cont++
              if(cont != 3){
                return contaBanc_senhatran.test(senha)
              }
          }
          

      }
  }
}
function definirNumConta(tipo: any, id: any){
        
  if(tipo == 'poupanca'){
      const contaBanc_conta = "010000" + id
      return contaBanc_conta.toString
  }
}


    const contaSchema = Joi.object({
        contaBanc_agencia: Joi.number().required(),
        contaBanc_conta: Joi.string().regex(contaBanc_conta).required(),
        contaBanc_senhatransacao: Joi.custom((senhaTransacao, helpers)=>{
            if(!validarSenhaTrans(senhaTransacao)){
                return helpers.error('400 SENHA Invalida')
            }
            return senhaTransacao
        }).required(),//.regex(ContaUtils.contaBanc_senhatran).required(),
        contaBanc_tipo: Joi.string().regex(contaBanc_tipo).required(),
        contaBanc_saldo: Joi.number().required(),
        contaBanc_status: Joi.string().regex(contaBanc_status).required(),
        usuario_id: Joi.number().required()
    })

    
    

    console.log()
    const conta = {
      contaBanc_agencia: 333,
      contaBanc_conta: "",
      contaBanc_senhatransacao: "1234",
      contaBanc_tipo: "poupanca",
      contaBanc_saldo: 0,
      contaBanc_status: "ativo",
      usuario_id: 1
    };
    // const numeroConta = definirNumConta(conta.contaBanc_tipo, conta.usuario_id)
    // conta.contaBanc_conta = numeroConta
    const resultado = contaSchema.validate(conta);
    if(resultado.error) {
        console.log(resultado.error.details)
    }else{
      console.log(conta)
    }
        





