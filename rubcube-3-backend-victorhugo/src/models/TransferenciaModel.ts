import { PrismaClient } from '@prisma/client';
import { ContaBancariaIn, ContaBancariaOut } from 'dtos/contaBancariaDTO';
import { TransferenciaIn } from 'dtos/transferenciaDTO';

const prisma = new PrismaClient();

export default class TransferenciaModel {

  create = async (trans: TransferenciaIn, conta_id: number, contaBancDesti_id: number) => {

    return await prisma.transferencia.create({
      data: {
        usuId_remetente: conta_id,
        usuId_destinatario: contaBancDesti_id,
        trans_valor: trans.trans_valor,
        trans_descricao: trans.trans_descricao,
        trans_status: 'ativo',
        trans_metodo: trans.trans_metodo,
      }
    }); 
  }

  getAll = async () => {
    return await prisma.transferencia.findMany();
  }

  getAllIdConta = async (contaBanc_id: any) => {
    return await prisma.transferencia.findMany({
      where:{
        OR: [
          {usuId_remetente: contaBanc_id},
          {usuId_destinatario: contaBanc_id}
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  getEachTrans = async (contaBanc_id: any, skip: any, ordem: any, dataInicial: any, dataFinal: any) => {
    return await prisma.transferencia.findMany({
      take: 7,
      skip: skip * 7,
      where:{
        OR: [
          {usuId_remetente: contaBanc_id},
          {usuId_destinatario: contaBanc_id}
        ],
        createdAt: {
          lte: dataFinal,
          gte: dataInicial
        }
      },
      orderBy: {
        createdAt: ordem??'desc'
      }
    });
  }

  get = async (trans_id: number) => {
    return await prisma.transferencia.findUnique({
      where: {
        trans_id
      }
    });
  }

  delete = async (trans_id: number) => {
    return await prisma.transferencia.delete({
      where: {
        trans_id
      }
    })
  }

  update = async (trans_id: number, trans: TransferenciaIn) => {
    return await prisma.transferencia.update({
      where: {
        trans_id
      },
      data: {
        ...trans
      }
    })
  }

  getContaId = async (usuario_cpf: any) => {
    return await prisma.contaBancaria.findFirst({
      select: {
        contaBanc_id: true
      },
      where: {
        usuario: {
          usuario_cpf: {
            equals: usuario_cpf
          }
        }       
      }
    })
  }

  getAllEntrada = async (contaId: any, skip: any, ordem: any, dataInicial: any, dataFinal: any) => {
    return await prisma.transferencia.findMany({
      take: 7,
      skip: skip * 7,
      where: {
        usuId_destinatario: contaId,
        createdAt: {
          lte: dataFinal,
          gte: dataInicial
        }
      },
      orderBy: {
        createdAt: ordem??'desc'
      },
    })
  }

  getEveryEntrada = async (contaId: any) => {
    return await prisma.transferencia.findMany({
      where: {
        usuId_destinatario: contaId,
      },
    })
  }

  getAllSaida = async (contaId: any, skip: any, ordem: any, dataInicial: any, dataFinal: any) => {
    return await prisma.transferencia.findMany({
      take: 7,
      skip: skip * 7,
      where: {
        usuId_remetente: contaId,
        createdAt: {
          lte: dataFinal,
          gte: dataInicial
        }
      },
      orderBy: {
        createdAt: ordem?? 'desc'
      },

    })
  }

  getEverySaida = async (contaId: any) => {
    return await prisma.transferencia.findMany({
      where: {
        usuId_remetente: contaId,
      }
    })
  }
};