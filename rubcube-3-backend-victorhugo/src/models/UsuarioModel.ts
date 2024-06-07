import { PrismaClient } from '@prisma/client';
import { EnderecoIn } from 'dtos/enderecoDTO';
import { ContaBancariaIn } from 'dtos/contaBancariaDTO';
import { UsuarioIn, UsuarioOut } from 'dtos/usuarioDTO';

const prisma = new PrismaClient();

export default class UsuarioModel {

  create = async (user: UsuarioIn) => {
    return await prisma.usuario.create({
      data: {
        usuario_nome: user.usuario_nome,
        usuario_email: user.usuario_email,
        usuario_senha: user.usuario_senha,
        usuario_tel: user.usuario_tel,
        usuario_cpf: user.usuario_cpf,
        usuario_dtNascimento: user.usuario_dtNascimento + "T00:00:00.000Z",
      }
    }); 
  }
  

  getAll = async () => {
    return await prisma.usuario.findMany({
      include: {
        endereco: true,
        conta: true
      }
    });
  }

  get = async (usuario_id: number) => {
    return await prisma.usuario.findUnique({
      where: {
        usuario_id
      },
      include: {
        endereco: true,
        conta: {
          include: {
            transRem: true,
            transDest: true
          }
        }
      }
    });
  }

  getConta = async (usuario_id: number) => {
    return await prisma.usuario.findUnique({
      where: {
        usuario_id
      }
    });
  }

  getContaInfo = async (usuario_id: number) => {
    return await prisma.usuario.findUnique({
      select:{
        conta: true
      },
      where: {
        usuario_id
      }
    });
  }

  getCpf = async (usuario_cpf: string) => {
    return await prisma.usuario.findUnique({
      where: {
        usuario_cpf
      },
      include:{
        conta: true
      }
    });
  }

  getCpfporID = async (usuario_id: number) => {
    return await prisma.usuario.findUnique({
      where: {
        usuario_id
      },
      select: {
        usuario_cpf: true
      }
    });
  }

  delete = async (usuario_id: number) => {
    return await prisma.usuario.delete({
      where: {
        usuario_id
      }
      
    })
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
};