import { PrismaClient } from '@prisma/client';
import { EnderecoIn } from 'dtos/enderecoDTO'; 
const prisma = new PrismaClient();

export default class EnderecoModel {

  create = async (end: EnderecoIn) => {//, usuarioid: UsuarioOut
    return await prisma.endereco.create({
      data: end//{
        // ...end,
        // usuario_id: usuarioid.usuario_id
      // }
    }); 
  }

  getAll = async (usuario_id: any) => {
    return await prisma.endereco.findMany({
      where: {
        usuario_id
      }
    });
  }

  getEndByUserId = (usuario_id: number) => {
    return prisma.endereco.findFirst({
      where: {
        usuario_id
      }
    });
  }

  get = async (end_id: number) => {
    return await prisma.endereco.findFirst({
      where: {
      end_id
      }
    });
  }

  delete = async (end_id: number) => {
    return await prisma.endereco.delete({
      where: {
        end_id
      }
    })
  }

  update = async (end_id: number, endereco: EnderecoIn) => {
    return await prisma.endereco.update({
      where: {
        end_id
      },
      data: {
        ...endereco
      }
    })
  }
};