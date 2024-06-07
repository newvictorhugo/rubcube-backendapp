import { PrismaClient } from '@prisma/client';
import { EnderecoIn } from 'dtos/enderecoDTO';
import { ContaBancariaIn } from 'dtos/contaBancariaDTO';
import { UsuarioIn, UsuarioOut } from 'dtos/usuarioDTO';
import { AlterarEndIn } from 'dtos/rubbankDTO';

const prisma = new PrismaClient();

export default class RUBBANKModel {
  
  getAll = async () => {
    return await prisma.usuario.findMany({
      include: {
        endereco: true,
        conta: true
      }
    });
  }

  getIdEnd = async (endId_param: number) => {
    return await prisma.endereco.findUnique({
      where: {
        end_id: endId_param  
      },
      select: {
        end_id: true
      }
    });
  }

  getDadoBanc = async (usuario_id: number) => {
    return await prisma.usuario.findUnique({
      select:{
        conta:{
          select:{
            contaBanc_agencia: true,
            contaBanc_conta: true,
            contaBanc_tipo: true
          }
        },
        usuario_cpf: true,
        usuario_nome: true,

      },
      where: {
        usuario_id
      },
    });
  }

  getDadoEnd = async (usuario_id: number) => {
    return await prisma.usuario.findUnique({
      select:{
        endereco:{
          select:{
            end_id: true,
            end_cep: true,
            end_rua: true,
            end_num: true,
            end_complem: true,
            end_bairro: true,
            end_cidade: true,
            end_uf: true
          }
        },
      },
      where: {
        usuario_id
      },
    });
  }

  getUsuario = async (usuario_id: number) => {
    return await prisma.usuario.findUnique({
      // select:{
      //   usuario_nome: true,
      //   usuario_email: true,
      //   usuario_tel: true,
      //   usuario_dtNascimento: true
      // },
      where: {
        usuario_id
      },
    });
  }

  getDadoEndPorId = async (usuario_id: number, end_id: number) => {
    return await prisma.usuario.findUnique({
      select:{
        endereco:{
          where:{
            end_id: end_id
          },
          select:{
            end_id: true,
            end_cep: true,
            end_rua: true,
            end_num: true,
            end_complem: true,
            end_bairro: true,
            end_cidade: true,
            end_uf: true
          }
        },
      },
      where: {
      usuario_id
      },
    });
  }


  update = async (usuario_id: number, user: UsuarioIn) => {
    return await prisma.usuario.update({
      where: {
        usuario_id
      },
      data: {
        ...user
      }
    })
  }

  putDadoEnd = async (end_id: any, end: AlterarEndIn) => {
    return await prisma.endereco.update({
      where: {
        end_id
      },
      data: {
        ...end
      }
    })
  }

  putSenhaApp = async (usuario_id: any, senhaApp: string) => {
    return await prisma.usuario.update({
      where: {
        usuario_id
      },
      data: {
        usuario_senha: senhaApp
      }
    })
  }

  putSenhaTrans = async (contaBanc_id: any, senhaTrans: string) => {
    return await prisma.contaBancaria.update({
      where: {
        contaBanc_id
      },
      data: {
        contaBanc_senhatransacao: senhaTrans
      }
    })
  }

  putUsuario = async (usuario_id: any, usuario: any) => {
    return await prisma.usuario.update({
      where: {
        usuario_id
      },
      data: {
        usuario_nome: usuario.usuario_nome,
        usuario_tel: usuario.usuario_tel,
        usuario_dtNascimento: usuario.usuario_dtNascimento+ "T00:00:00.000Z",
      }
    })
  }
};