import { PrismaClient } from '@prisma/client';
import { ContaBancariaIn } from 'dtos/contaBancariaDTO';  

const prisma = new PrismaClient();

export default class ContaBancariaModel {

  create = async (contaB: ContaBancariaIn) => {
    return await prisma.contaBancaria.create({
      data: {
        contaBanc_agencia: 333,
        contaBanc_conta: contaB.contaBanc_conta,
        contaBanc_senhatransacao: contaB.contaBanc_senhatransacao,
        contaBanc_tipo: contaB.contaBanc_tipo,
        contaBanc_saldo: 0,
        contaBanc_status: "ativo",
        usuario_id: contaB.usuario_id,
      }
    }); 
  }

  getAll = async () => {
    return await prisma.contaBancaria.findMany();
  }

  get = async (contaBanc_id: number) => {
    return await prisma.contaBancaria.findUnique({
      where: {
        contaBanc_id
      }
    });
  }

  getAccountByUserId = (usuario_id: number) => {
    return prisma.contaBancaria.findFirst({
      where: {
        usuario_id
      }
    });
  }


  getContaCpf = async (usuario_cpf: any) => {
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

  getContaPorNum = async (contaBanc_conta: string, contaBanc_agencia: number) => {
    return await prisma.contaBancaria.findFirst({
      where: {
        contaBanc_conta,
        contaBanc_agencia
      },
      include: {
        usuario: true
      }
    })
  }

  delete = async (contaBanc_id: number) => {
    return await prisma.contaBancaria.delete({
      where: {
        contaBanc_id
      }
    })
  }

  update = async (contaBanc_id: number, contaB: ContaBancariaIn) => {
    return await prisma.contaBancaria.update({
      where: {
        contaBanc_id
      },
      data: {
        ...contaB
      }
    })
  }
  updateSaldo = async (contaBanc_id: number, valor: ContaBancariaIn) => {
    return await prisma.contaBancaria.update({
      where: {
        contaBanc_id
      },
      data: {
        contaBanc_saldo: valor.contaBanc_saldo
      }
      
    })
  }
};