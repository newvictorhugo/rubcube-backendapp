import { Request, Response } from "express";
import { AlterarUsuario, UsuarioIn, UsuarioOut } from "dtos/usuarioDTO";
import UsuarioModel from "models/UsuarioModel";
import jwt from 'jsonwebtoken'
import RUBBANKModel from "models/RUBBANKModel";
import ContaBancariaController from "./ContaBController";
import ContaBancariaModel from "models/ContaBancariaModel";
import EnderecoModel from "models/EnderecoModel";
import { AlterarEndIn, AlterarEndOut, AlterarSenhaApp, AlterarSenhaTrans } from "dtos/rubbankDTO";

// import { UsuarioUtils } from "utils/UsuarioUtils";

const rubbankModel = new RUBBANKModel();
const contaBancariaModel = new ContaBancariaModel()
const enderecoModel = new EnderecoModel()
const usuarioModel = new UsuarioModel()

export default class RUBBANKController {

  getDadoBanc = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      // const contaBanc = await contaBancariaModel.getAccountByUserId(usuario_id);
      const dadoBanc = await rubbankModel.getDadoBanc(usuario_id)

      if (dadoBanc) {
        res.status(200).json(dadoBanc);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Dados bancarios not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get dados bancarios", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get dados bancarios",
      });
    }
  };

  getDadoUsu = async (req: Request, res: Response) => {
    try {
      const usuario_cpf: string = req.body.usuario_cpf
      const dadoUsu = await usuarioModel.getCpf(usuario_cpf)
      const dadoBanc = await rubbankModel.getDadoBanc(dadoUsu!.usuario_id)

      if (dadoBanc) {
        res.status(200).json(dadoBanc);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Dados bancarios not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get dados bancarios", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get dados bancarios",
      });
    }
  };

  getDadoEnd = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      // const endereco = await enderecoModel.getEndByUserId(usuario_id);
      const dadoEnd = await rubbankModel.getDadoEnd(usuario_id)

      if (dadoEnd) {
        res.status(200).json(dadoEnd);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Dados de endereco not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get dados de endereco", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get dados de endereco",
      });
    }
  };

  putDadoEnd = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const endId_param = Number(req.params.id)
      const dadoEnd = await rubbankModel.getDadoEndPorId(usuario_id, endId_param)
      const updateEnd: AlterarEndIn = req.body;
      if(!dadoEnd?.endereco[0]){
        return res.status(404).json({
          error: "USR-06",
          message: "Endereco not found.",
        });
      }else{
        const endUpdated = await rubbankModel.putDadoEnd(endId_param, updateEnd);
        if (endUpdated) {
          res.status(200).json(endUpdated);
        } else {
          res.status(404).json({
            error: "USR-06",
            message: "Endereco not found.",
          });
        }
      }
    } catch (e) {
      console.log("Failed to update endereco", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update endereco",
      });
    }
  };

  putSenhaApp = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const updateSenhaApp: AlterarSenhaApp = req.body;
      const usuario = await usuarioModel.getConta(usuario_id);
      const usuario_senha = usuario?.usuario_senha
      if(usuario_senha != updateSenhaApp.usuario_senha){
        return res.status(401).json({
          error: "USR-06",
          message: "Senha atual invalida",
        });
      }
      if(usuario_senha == updateSenhaApp.usuario_senhanova){
        return res.status(401).json({
          error: "USR-06",
          message: "Voce esta tentando alterar para a mesma senha.",
        });
      }
      if(updateSenhaApp.usuario_senhanova != updateSenhaApp.usuario_senhanovaconfirm){
        return res.status(401).json({
          error: "USR-06",
          message: "Senhas são diferentes",
        });
      }
      const senhaAppUpdated = await rubbankModel.putSenhaApp(usuario_id, updateSenhaApp.usuario_senhanova);
      if (senhaAppUpdated) {
        res.status(200).json({
          data: senhaAppUpdated,
          message: "Alteração realizada",
          message2: "Você redefiniu sua senha com sucesso!"
        });
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Senha not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update senha", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update senha",
      });
    }
  };

  putSenhaTrans = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const updateSenhaTrans: AlterarSenhaTrans = req.body;
      const contaBanc = await contaBancariaModel.getAccountByUserId(usuario_id);
      const senhaTrans = contaBanc?.contaBanc_senhatransacao
      if(senhaTrans != updateSenhaTrans.contaBanc_senhatransacao){
        return res.status(401).json({
          error: "USR-06",
          message: "Senha atual invalida",
        });
      }
      if(senhaTrans == updateSenhaTrans.contaBanc_senhatransacaonova){
        return res.status(401).json({
          error: "USR-06",
          message: "Voce esta tentando alterar para a mesma senha.",
        });
      }
      if(updateSenhaTrans.contaBanc_senhatransacaonova != updateSenhaTrans.contaBanc_senhatransacaonovaconfirm){
        return res.status(401).json({
          error: "USR-06",
          message: "Senhas são diferentes",
        });
      }
      const senhaTransUpdated = await rubbankModel.putSenhaTrans(contaBanc?.contaBanc_id, updateSenhaTrans.contaBanc_senhatransacaonova);
      if (senhaTransUpdated) {
        res.status(200).json({
          data: senhaTransUpdated,
          message: "Alteração realizada",
          message2: "Você redefiniu sua senha com sucesso!"
        });
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Senha not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update senha", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update senha",
      });
    }
  };

  putUsuario = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const updateUsuario: AlterarUsuario = req.body;
      const usuario = await rubbankModel.getUsuario(usuario_id);
      const usuarioUpdated = await rubbankModel.putUsuario(usuario?.usuario_id, updateUsuario);
      // usuario!.usuario_dtNascimento = new Date(usuario!.usuario_dtNascimento)
      if (usuarioUpdated) {
        res.status(200).json(usuarioUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Usuario not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update usuario", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update usuario",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const users: UsuarioOut[] | null = await rubbankModel.getAll();
      res.status(200).json(users);
    } catch (e) {
      console.log("Failed to get all users", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all users",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = parseInt(req.params.id);
      const updateUser: UsuarioIn = req.body;
      const userUpdated: UsuarioOut | null = await rubbankModel.update(
        usuario_id,
        updateUser
      );

      if (userUpdated) {
        res.status(200).json(userUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update user", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update user",
      });
    }
  };

}
