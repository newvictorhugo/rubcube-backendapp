import { Request, Response, NextFunction } from "express";
import { ContaBancariaIn, ContaBancariaOut } from "dtos/contaBancariaDTO";
import ContaBancariaModel from "models/ContaBancariaModel";
import { TransferenciaIn } from "dtos/transferenciaDTO";
import { UsuarioIn } from "dtos/usuarioDTO";
import UsuarioModel from "models/UsuarioModel";

const contaBancariaModel = new ContaBancariaModel();
const usuarioModel = new UsuarioModel()

export default class ContaBancariaController {
  create = async (req: Request, res: Response) => {
    try {
      const contaB: ContaBancariaIn = req.body;
      const newContaB: ContaBancariaOut = await contaBancariaModel.create(contaB);
      res.status(201).json(newContaB);
    } catch (e) {
      console.log("Failed to create conta bancaria", e)
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create conta bancaria",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id');
      const contaBanc_id = await contaBancariaModel.getAccountByUserId(usuario_id);
      if (contaBanc_id) {
        return res.status(200).json(contaBanc_id);
      } else {
        return res.status(404).json({
          error: "USR-06",
          message: "Conta bancaria not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get conta bancaria", e);
      return res.status(500).send({
        error: "USR-02",
        message: "Failed to get conta bancaria",
      });
    }
  };

  getSaldo = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id');
      const contaBanc = await contaBancariaModel.getAccountByUserId(usuario_id);
      const contaBanc_saldo = contaBanc?.contaBanc_saldo
      if (contaBanc) {
        return res.status(200).json({contaBanc_saldo});
      } else {
        return res.status(404).json({
          error: "USR-06",
          message: "Nao e possivel acessar seu saldo",
        });
      }
    } catch (e) {
      console.log("Failed to get conta bancaria", e);
      return res.status(500).send({
        error: "USR-02",
        message: "Failed to get conta bancaria",
      });
    }
  };

  getSaldoValidar = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id');
      const contaBanc = await contaBancariaModel.getAccountByUserId(usuario_id);
      const contaBanc_saldo = contaBanc!.contaBanc_saldo
      const valor: number = req.body.trans_valor
      if(contaBanc_saldo < valor){
        return res.status(400).json({
          error: "USR-06",
          message: "Saldo insuficiente",
        });
      }
      if(valor <= 0){
        return res.status(400).json({
          error: "USR-06",
          message: "Valor inválido",
        });
      }
      if (contaBanc) {
        return res.status(200).json({contaBanc_saldo});
      } else {
        return res.status(404).json({
          error: "USR-06",
          message: "Nao e possivel acessar seu saldo",
        });
      }
    } catch (e) {
      console.log("Failed to get conta bancaria", e);
      return res.status(500).send({
        error: "USR-02",
        message: "Failed to get conta bancaria",
      });
    }
  };

  getSenhaTransValidar = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id');
      const contaBanc = await contaBancariaModel.getAccountByUserId(usuario_id);
      const contaBanc_senhatransacao = contaBanc!.contaBanc_senhatransacao
      const senhaTrans = req.body.contaBanc_senhatransacao
      if(contaBanc_senhatransacao !== senhaTrans){
        return res.status(400).json({
          error: "USR-06",
          message: "Senha inválida",
          message2: "Verifique se digitou sua senha corretamente"
        });
      }
      if (contaBanc) {
        return res.status(200).json({contaBanc_senhatransacao});
      } else {
        return res.status(404).json({
          error: "USR-06",
          message: "Erro ao validar senha",
        });
      }
    } catch (e) {
      console.log("Failed to get conta bancaria", e);
      return res.status(500).send({
        error: "USR-02",
        message: "Failed to get conta bancaria",
      });
    }
  };

  getNumConta = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const contaBancRem = await contaBancariaModel.getAccountByUserId(usuario_id);
      const contaBanc_agencia = req.body.contaBanc_agencia;
      const contaBanc_conta = req.body.contaBanc_conta;
      const contaBancDes = await contaBancariaModel.getContaPorNum(contaBanc_conta, contaBanc_agencia);
      const usu_destinatario = await usuarioModel.getCpf(contaBancDes!.usuario.usuario_cpf);

      if(contaBancRem?.contaBanc_conta === contaBanc_conta && contaBancRem?.contaBanc_agencia === contaBanc_agencia){
        return res.status(400).json({
          error: "USR-06",
          message: "Não é possível transferir para a sua mesma conta.",
        });
      }else{
        if (contaBancDes) {
          return res.status(200).json(usu_destinatario);
        } else {
          return res.status(404).json({
            error: "USR-06",
            message: "Número ou agência inválido",
            message2: "Verifique se os dados estão corretos."
          });
        }
      }
    } catch (e) {
      console.log("Failed to get conta bancaria", e);
      return res.status(500).send({
        error: "USR-02",
        message: "Número ou agência inválido",
      });
    }
  };


  getAll = async (req: Request, res: Response) => {
    try {
      const contasB: ContaBancariaOut[] | null = await contaBancariaModel.getAll();
      res.status(200).json(contasB);
    } catch (e) {
      console.log("Failed to get all contas bancarias", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all contas bancarias",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const conta = await contaBancariaModel.getAccountByUserId(usuario_id);
      const contaBanc_id = conta!.contaBanc_id
      const updateContaB: ContaBancariaIn = req.body;
      const contaBUpdated: ContaBancariaOut | null = await contaBancariaModel.update(contaBanc_id, updateContaB);

      if (contaBUpdated) {
        res.status(200).json(contaBUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Conta bancaria not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update conta bancaria", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update conta bancaria",
      });
    }
  };

  updateSaldoDestinatario = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if(req.body.usuId_destinatario){        
        console.log("ENTROU NO IF CPF")
        const usuario_cpf: string = req.body.usuId_destinatario
        const pegaTransValor: ContaBancariaIn = req.body.trans_valor;
        const pegaIdConta : any | null = await contaBancariaModel.getContaCpf(usuario_cpf)
        const { contaBanc_id } = pegaIdConta;
        const pegaConta: ContaBancariaIn | null = await contaBancariaModel.get(contaBanc_id)
        if(!pegaConta){
          res.status(404).json({
            error: "USR-06",
            message: "Conta bancaria not found.",
          });
        }else{
          const saldo: number = (pegaConta!.contaBanc_saldo)
          const novoSaldo: ContaBancariaIn = {
          contaBanc_agencia: pegaConta!.contaBanc_agencia,
          contaBanc_conta: pegaConta!.contaBanc_conta,
          contaBanc_senhatransacao: pegaConta!.contaBanc_senhatransacao,
          contaBanc_tipo: pegaConta!.contaBanc_tipo,
          contaBanc_saldo: saldo + Number(pegaTransValor),
          contaBanc_status: "Entrada",
          usuario_id: pegaConta!.usuario_id,
          }
          const contaBUpdated: ContaBancariaIn | null = await contaBancariaModel.updateSaldo(contaBanc_id, novoSaldo);

          if (contaBUpdated) {
            console.log("PASSOU UP SALDO DESTINATARIO")
            next()
          }else{
            res.status(404).json({
              error: "USR-06",
              message: "Conta bancaria not found.",
            });
          }
        }
      }
      if(req.body.contaBanc_agencia && req.body.contaBanc_conta){
        console.log("ENTROU NO IF DE CONTA AGENCIA")
        const {contaBanc_agencia, contaBanc_conta} = req.body
        const pegaConta = await contaBancariaModel.getContaPorNum(contaBanc_conta, contaBanc_agencia)
        if(!pegaConta){
          res.status(404).json({
            error: "USR-06",
            message: "Conta bancaria not found.",
          });
        }else{
          const saldo: number = (pegaConta!.contaBanc_saldo)
          const novoSaldo: ContaBancariaIn = {
          contaBanc_agencia: pegaConta!.contaBanc_agencia,
          contaBanc_conta: pegaConta!.contaBanc_conta,
          contaBanc_senhatransacao: pegaConta!.contaBanc_senhatransacao,
          contaBanc_tipo: pegaConta!.contaBanc_tipo,
          contaBanc_saldo: saldo + Number(req.body.trans_valor),
          contaBanc_status: "Entrada",
          usuario_id: pegaConta!.usuario_id,
          }
          const contaBUpdated: ContaBancariaIn | null = await contaBancariaModel.updateSaldo(pegaConta.contaBanc_id, novoSaldo);

          if (contaBUpdated) {
            console.log("PASSOU UP SALDO DESTINATARIO")
            next()
          }else{
            res.status(404).json({
              error: "USR-06",
              message: "Conta bancaria not found.",
            });
          }
        }
      }
       
    }catch (e) {
      console.log("Failed to update conta bancaria", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update conta bancaria",
      });
    }
  };

  updateSaldoRemetente = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const pegaTransValor: ContaBancariaIn = req.body.trans_valor;
      const contaBanc = await contaBancariaModel.getAccountByUserId(usuario_id);
      const pegaSaldo = await contaBancariaModel.get(contaBanc!.contaBanc_id)
      if(!pegaSaldo){
        res.status(404).json({
          error: "USR-06",
          message: "Conta bancaria not found.",
        });
      }
      const saldo: number = (pegaSaldo!.contaBanc_saldo)
      const novoSaldo: ContaBancariaIn = {
        contaBanc_agencia: pegaSaldo!.contaBanc_agencia,
        contaBanc_conta: pegaSaldo!.contaBanc_conta,
        contaBanc_senhatransacao: pegaSaldo!.contaBanc_senhatransacao,
        contaBanc_tipo: pegaSaldo!.contaBanc_tipo,
        contaBanc_saldo: saldo - Number(pegaTransValor),
        contaBanc_status: pegaSaldo!.contaBanc_status,
        usuario_id: pegaSaldo!.usuario_id,
      }
      const contaBUpdated: ContaBancariaIn | null = await contaBancariaModel.updateSaldo(
        contaBanc!.contaBanc_id,
        novoSaldo
      );


      if (contaBUpdated) {
        console.log("PASSOU UP SALDO REMETENTE")
        next()
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Conta bancaria not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update conta bancaria", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update conta bancaria",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const contaBanc_id: number = parseInt(req.params.id);
      const contaBDeleted = await contaBancariaModel.delete(contaBanc_id);
      res.status(204).json(contaBDeleted);
    } catch (e) {
      console.log("Failed to delete conta bancaria", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete conta bancaria",
      });
    }
  };
}
