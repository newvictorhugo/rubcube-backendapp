import { Request, Response } from "express";
import { EnderecoIn, EnderecoOut } from "dtos/enderecoDTO"; 
import EnderecoModel from "models/EnderecoModel";

const enderecoModel = new EnderecoModel();

export default class EnderecoController {
  create = async (req: Request, res: Response) => {
    try {
      const end: EnderecoIn = req.body;
      const newEnd: EnderecoOut = await enderecoModel.create(end);
      res.status(201).json(newEnd);
    } catch (e) {
      console.log("Failed to create endereco", e)
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create endereco",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const end_id = Number(req.params.id)
      const newEnd: EnderecoIn | null = await enderecoModel.get(end_id)
      if(newEnd?.usuario_id != usuario_id){
        return res.status(404).json({
          error: "USR-06",
          message: "Endereco not found.",
        });
      }

      if (newEnd) {
        res.status(200).json(newEnd);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Endereco not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get endereco", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get endereco",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const ends: EnderecoOut[] | null = await enderecoModel.getAll(usuario_id);
      res.status(200).json(ends);
    } catch (e) {
      console.log("Failed to get all enderecos", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all enderecos",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const end_id: number = parseInt(req.params.id);
      const updateEnd: EnderecoIn = req.body;
      const userUpdated: EnderecoOut | null = await enderecoModel.update(
        end_id,
        updateEnd
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
      const end_id: number = parseInt(req.params.id);
      const endDeleted = await enderecoModel.delete(end_id);
      res.status(204).json(endDeleted);
    } catch (e) {
      console.log("Failed to delete endereco", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete endereco",
      });
    }
  };
}
