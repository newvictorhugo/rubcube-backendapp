import { Request, Response } from "express";
import { UsuarioIn, UsuarioOut } from "dtos/usuarioDTO";
import UsuarioModel from "models/UsuarioModel";
import jwt from 'jsonwebtoken'

// import { UsuarioUtils } from "utils/UsuarioUtils";

const usuarioModel = new UsuarioModel();

export default class UsuarioController {
  create = async (req: Request, res: Response) => {
    try {
      const user: UsuarioIn = req.body;
      const { verifyOnly } = req.query;
      const newUser: UsuarioOut = await usuarioModel.create(user);
      user.usuario_dtNascimento = new Date(user.usuario_dtNascimento)

      res.status(201).json(newUser);
    } catch (e) {
      console.log("Algumas informações já estão relacionadas a outra conta", e)
      res.status(500).send({
        error: "USR-01",
        message: "Algumas informações já estão relacionadas a outra conta",
      });
    }
  };
  
  get = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const newUser: UsuarioOut | null = await usuarioModel.get(usuario_id);

      if (newUser) {
        res.status(200).json(newUser);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get user",
      });
    }
  };

  getCPF = async (req: Request, res: Response) => {
    try{
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const cpf_destinatario = req.body.usuId_destinatario;
      const usu_destinatario = await usuarioModel.getCpf(cpf_destinatario);
      if(!usu_destinatario){
        res.status(404).json({
          error: "USR-06",
          message: "CPF não encontrado.",
        });
      }else{
        if(usu_destinatario?.usuario_id === usuario_id){
          res.status(400).json({
            error: "USR-06",
            message: "Não é possível transferir para a sua mesma conta.",
          })
        }else{
          res.status(200).json(usu_destinatario);
        }
      }
    }catch(e){
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get user",
      });
    }
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const users: UsuarioOut[] | null = await usuarioModel.getAll();
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
      const userUpdated: UsuarioOut | null = await usuarioModel.update(
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

  delete = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = parseInt(req.params.id);
      const userDeleted = await usuarioModel.delete(usuario_id);
      res.status(204).json(userDeleted);
    } catch (e) {
      console.log("Failed to delete user1", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete user2",
      });
    }
  };

  
  login = async (req: Request, res: Response) => {
    console.log("_____________________ENTROU NO LOGIN_____________________")
    console.log(req.body)
    const {usuario_cpf, usuario_senha} = req.body
    console.log(usuario_cpf, usuario_senha)
    const usuario = await usuarioModel.getCpf(usuario_cpf)
    console.log(usuario)
    
    if(!usuario){
      res.status(401).send({
        message: "CPF e/ou senha incorretos",
      })
    }else{
      const verificaSenha = usuario_senha == usuario.usuario_senha

      if(!verificaSenha){

        res.status(401).send({
          message: "CPF e/ou senha incorretos",

        })
      }else{
        const token = jwt.sign({id: usuario.usuario_id,}, process.env.SECRET_JWT || "teste123",{expiresIn: "1h"})
        return res.json({
          token
        })
      }
    }
  };
}
