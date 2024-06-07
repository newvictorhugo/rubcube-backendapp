import { NextFunction, Request, Response } from "express";
import { TransferenciaIn, TransferenciaOut } from "dtos/transferenciaDTO"; 
import TransferenciaModel from "models/TransferenciaModel";
import { func } from "joi";
import { ContaBancariaIn } from "dtos/contaBancariaDTO";
import ContaBancariaModel from "models/ContaBancariaModel";
import { DateTime } from "luxon";
import UsuarioModel from "models/UsuarioModel";

const transferenciaModel = new TransferenciaModel()
const contaBancariaModel = new ContaBancariaModel()
const usuarioModel = new UsuarioModel()

interface CustomRequest extends Request {
  numPags?: number
}

export default class TransferenciaController {
  create = async (req: Request, res: Response) => {
    try {
      console.log("ENTROU NO CREATE")
      const usuario_id: number = Reflect.get(req.body, 'usuario_id')
      const destinatario_cpf: string = req.body.usuId_destinatario
      const contaBanc_agencia: number = req.body.contaBanc_agencia
      const contaBanc_conta: string = req.body.contaBanc_conta
      const contaBanc = await contaBancariaModel.getAccountByUserId(usuario_id);
      delete req.body['usuario_id']
      const trans: TransferenciaIn = req.body;
      if(destinatario_cpf){
        const pegaIdConta : any | null = await contaBancariaModel.getContaCpf(destinatario_cpf)
        const { contaBanc_id } = pegaIdConta;
        const newTrans: TransferenciaOut = await transferenciaModel.create(trans, contaBanc!.contaBanc_id, contaBanc_id);
        res.status(201).json({
          data: newTrans,
          message: 'Sua transferência foi enviada com sucesso!'
        });
      }
      if(contaBanc_agencia && contaBanc_conta){
        const pegaIdConta = await contaBancariaModel.getContaPorNum(contaBanc_conta, contaBanc_agencia)
        const contaBanc_id = pegaIdConta!.contaBanc_id;
        const newTrans: TransferenciaOut = await transferenciaModel.create(trans, contaBanc!.contaBanc_id, contaBanc_id);
        res.status(201).json({
          data: newTrans,
          message: 'Sua transferência foi enviada com sucesso!'
        });
      }
    } catch (e) {
      console.log("Failed to create transferencia", e)
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create transferencia",
      });
    }
    
  };

  get = async (req: Request, res: Response) => {
    try {
      const usuario_id = Reflect.get(req.body, 'usuario_id')
      const contaBanc = await contaBancariaModel.getAccountByUserId(usuario_id);
      const trans_id = Number(req.params.id)
      const newTrans: TransferenciaOut | null = await transferenciaModel.get(trans_id);
      const contaBanc_id = contaBanc?.contaBanc_id
      const id_remetente = newTrans?.usuId_remetente
      const id_destinatario = newTrans?.usuId_destinatario
      if(id_remetente != contaBanc_id && id_destinatario != contaBanc_id){
        return res.status(404).json({
          error: "USR-06",
          message: "Transferencia nao encontrada.",
        });
      }

      if (newTrans) {
        res.status(200).json(newTrans);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Transferencia not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get transferencia", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get transferencia",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const trans: TransferenciaOut[] | null = await transferenciaModel.getAll();
      res.status(200).json(trans);
    } catch (e) {
      console.log("Failed to get all transferencias", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all transferencias",
      });
    }
  };

  getAllIdConta = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const usuario_id = Reflect.get(req.body, 'usuario_id')
      const contaBanc = await contaBancariaModel.getAccountByUserId(usuario_id);
      const trans: TransferenciaOut[] | null = await transferenciaModel.getAllIdConta(contaBanc?.contaBanc_id);
      console.log(trans.length)
      const calcPag = Math.ceil(trans.length/5)
      req.numPags = calcPag
      // req.numTrans = transs.length
      next()
      // res.status(200).json(transs);
    } catch (e) {
      console.log("Failed to get all transferencias", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all transferencias",
      });
    }
  };

  getEachTrans = async (req: CustomRequest, res: Response) => {
    try {
      let pagPular = Number(req.query.page) -1
      if(Number.isNaN(pagPular)){
        pagPular = 0
      }
      if(pagPular == -1){
        return res.status(400).send({
          error: "USR-03",
          message: "Nao existe pagina 0",
        })
      }

      const ordemAscDesc = req.query.ordem
      if(ordemAscDesc?.length == 2){
        return res.status(400).send({error: 'Insira apenas um tipo de ordem para o extrato'})
      }

      let dataInicial = req.query.dataInicial 
      let dataFinal = req.query.dataFinal
      if(dataInicial != undefined){
        dataInicial += "T00:00:00.000Z"
      }
      if(dataFinal != undefined){
        dataFinal += "T00:00:00.000Z"
      }

      const dias = req.query.dias
      if(dias == '15'){
        dataInicial = DateTime.now().minus({ days: 15 }).toISO();
        dataFinal = DateTime.now().toISO();
      }else if(dias == '30'){
        dataInicial = DateTime.now().minus({ days: 30 }).toISO();
        dataFinal = DateTime.now().toISO();
      }else if(dias == '60'){
        dataInicial = DateTime.now().minus({ days: 60 }).toISO();
        dataFinal = DateTime.now().toISO();
      }else if(dias == '90'){
        dataInicial = DateTime.now().minus({ days: 90 }).toISO();
        dataFinal = DateTime.now().toISO();
      }
      const usuario_id = Reflect.get(req.body, 'usuario_id')
      const contaBanc = await contaBancariaModel.getAccountByUserId(usuario_id);
      const trans: TransferenciaOut[] | null = await transferenciaModel.getEachTrans(contaBanc?.contaBanc_id, pagPular, ordemAscDesc, dataInicial, dataFinal);
      res.status(200).json({trans, numPags: req.numPags});
    } catch (e) {
      console.log("Failed to get all transferencias", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all transferencias",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const trans_id: number = parseInt(req.params.id);
      const updateTrans: TransferenciaIn = req.body;
      const transUpdated: TransferenciaOut | null = await transferenciaModel.update(
        trans_id,
        updateTrans
      );

      if (transUpdated) {
        res.status(200).json(transUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Transferencia not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update transferencia", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update transferencia",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const trans_id: number = parseInt(req.params.id);
      const transDeleted = await transferenciaModel.delete(trans_id);
      res.status(204).json(transDeleted);
    } catch (e) {
      console.log("Failed to delete transferencia", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete transferencia",
      });
    }
  };
  
  getAllEntrada = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

      const usu_id = Reflect.get(req.body, 'usuario_id')
      let pagPular = Number(req.query.page) -1
      if(Number.isNaN(pagPular)){
        pagPular = 0
      }
      if(pagPular == -1){
        return res.status(400).send({
          error: "USR-03",
          message: "Nao existe pagina 0",
        })
      }

      const ordemAscDesc = req.query.ordem
      if(ordemAscDesc?.length == 2){
        return res.status(400).send({error: 'Insira apenas um tipo de ordem para o extrato'})
      }

      let dataInicial = req.query.dataInicial 
      let dataFinal = req.query.dataFinal
      if(dataInicial != undefined){
        dataInicial += "T00:00:00.000Z"
      }
      if(dataFinal != undefined){
        dataFinal += "T00:00:00.000Z"
      }
      const agora = DateTime.now().toISODate()
      const dias = req.query.dias
      if(dias == '15'){
        dataInicial = DateTime.now().minus({ days: 15 }).toISO();
        dataFinal = DateTime.now().toISO();
      }else if(dias == '30'){
        dataInicial = DateTime.now().minus({ days: 30 }).toISO();
        dataFinal = DateTime.now().toISO();
      }else if(dias == '60'){
        dataInicial = DateTime.now().minus({ days: 60 }).toISO();
        dataFinal = DateTime.now().toISO();
      }else if(dias == '90'){
        dataInicial = DateTime.now().minus({ days: 90 }).toISO();
        dataFinal = DateTime.now().toISO();
      }
      const getcontaId = await usuarioModel.getContaInfo(usu_id)
      const conta_id = (getcontaId?.conta[0].contaBanc_id)
      const trans: TransferenciaOut[] | null = await transferenciaModel.getAllEntrada(conta_id, pagPular, ordemAscDesc, dataInicial, dataFinal);
      console.log(trans)
      res.status(200).json({trans, numPags: req.numPags});
    } catch (e) {
      console.log("Failed to get all transferencias", e);
      
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all transferencias",
      });
    }
  };

  getEveryEntrada = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

      const usu_id = Reflect.get(req.body, 'usuario_id')
      const getcontaId = await usuarioModel.getContaInfo(usu_id)
      const conta_id = (getcontaId?.conta[0].contaBanc_id)
      const trans: TransferenciaOut[] | null = await transferenciaModel.getEveryEntrada(conta_id);
      console.log(trans.length)
      const calcPag = Math.ceil(trans.length/5)
      req.numPags = calcPag
      // req.numTrans = trans.length
      next()
      // res.status(200).json(trans);
    } catch (e) {
      console.log("Failed to get all transferencias", e);
      
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all transferencias",
      });
    }
  };

  getAllSaida = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

      const usu_id = Reflect.get(req.body, 'usuario_id')
      let pagPular = Number(req.query.page) - 1
      if(Number.isNaN(pagPular)){
        pagPular = 0
      }
      if(pagPular == -1){
        return res.status(400).send({
          error: "USR-03",
          message: "Nao existe pagina 0",
        })
      }

      let ordemAscDesc = req.query.ordem
      if(ordemAscDesc?.length == 2){
        return res.status(400).send({error: 'Insira apenas um tipo de ordem para o extrato'})
      }
      if(ordemAscDesc == undefined){
        ordemAscDesc = 'desc'
      }

      let dataInicial = req.query.dataInicial 
      let dataFinal = req.query.dataFinal
      if(dataInicial != undefined){
        dataInicial += "T00:00:00.000Z"
      }
      if(dataFinal != undefined){
        dataFinal += "T00:00:00.000Z"
      }
      const agora = DateTime.now().toISODate()
      const dias = req.query.dias
      if(dias == '15'){
        dataInicial = DateTime.now().minus({ days: 15 }).toISO();
        dataFinal = DateTime.now().toISO();
      }else if(dias == '30'){
        dataInicial = DateTime.now().minus({ days: 30 }).toISO();
        dataFinal = DateTime.now().toISO();
      }else if(dias == '60'){
        dataInicial = DateTime.now().minus({ days: 60 }).toISO();
        dataFinal = DateTime.now().toISO();
      }else if(dias == '90'){
        dataInicial = DateTime.now().minus({ days: 90 }).toISO();
        dataFinal = DateTime.now().toISO();
      }
      const getcontaId = await usuarioModel.getContaInfo(usu_id)
      const conta_id = (getcontaId?.conta[0].contaBanc_id)
      const trans: TransferenciaOut[] | null = await transferenciaModel.getAllSaida(conta_id, pagPular, ordemAscDesc, dataInicial, dataFinal);
      // if(req.query.page == (trans.length)/5){}
      // console.log(trans)
      res.status(200).json({trans, numPags: req.numPags});
    } catch (e) {
      console.log("Failed to get all transferencias", e);
      
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all transferencias",
      });
    }
  };

  getEverySaida = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

      const usu_id = Reflect.get(req.body, 'usuario_id')
      const getcontaId = await usuarioModel.getContaInfo(usu_id)
      const conta_id = (getcontaId?.conta[0].contaBanc_id)
      const trans: TransferenciaOut[] | null = await transferenciaModel.getEverySaida(conta_id);
      console.log(trans.length)
      // req.numTrans = trans.length
      const calcPag = Math.ceil(trans.length/5)
      req.numPags = calcPag
      console.log(calcPag)
      next()
      // res.status(200).json(trans);
    } catch (e) {
      console.log("Failed to get all transferencias", e);
      
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all transferencias",
      });
    }
  };
}
