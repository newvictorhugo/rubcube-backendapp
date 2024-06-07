import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.usuario.create({
    data: {
      usuario_nome: 'Pedro',
      usuario_email: 'pedro@prisma.io',
      usuario_senha: '123',
      usuario_tel: '159880231',
      usuario_cpf: '321',
      usuario_dtNascimento: new Date(),
      createdAt: new Date(),
      updateAt: new Date(),
    },
  })
  console.log(user)
  const end = await prisma.endereco.create({
    data: {
      end_cep: '19040-50',
      end_rua: 'Rua rubcube',
      end_num: '12', 
      end_complem: 'galeria+doida', 
      end_bairro: 'Bairro rub', 
      end_cidade: 'Presidente Prudente', 
      end_uf: 'SP',
      createdAt: new Date(),
      updateAt: new Date(),
      usuario_Id: user.usuario_id,
    }
  })
  console.log(end)

  const contaBancaria = await prisma.contaBancaria.create({
    data: {
      contaBanc_agencia: 123,
      contaBanc_conta: '123',
      contaBanc_senhatransacao: '123',
      contaBanc_tipo: 'Poupanca',
      contaBanc_saldo: 1000,
      contaBanc_status: 'Ativo',
      usuario_id: user.usuario_id,
      createAt: new Date(),
      updateAt: new Date()
    }
  })
  console.log(contaBancaria)

  const transferencia = await prisma.transferencia.create({
    data: {
      usuId_remetente: 1,
      usuId_destinatario: 2,
      trans_valor: 100,
      trans_descricao: 'abc',
      trans_status: 'pendente',
      trans_metodo: 'pix',
      createdAt: new Date()
    }
  })
  console.log(transferencia)
  
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })