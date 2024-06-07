-- CreateTable
CREATE TABLE "Usuario" (
    "usuario_id" SERIAL NOT NULL,
    "usuario_nome" TEXT NOT NULL,
    "usuario_email" TEXT NOT NULL,
    "usuario_senha" TEXT NOT NULL,
    "usuario_tel" TEXT NOT NULL,
    "usuario_cpf" TEXT NOT NULL,
    "usuario_dtNascimento" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "end_id" SERIAL NOT NULL,
    "end_cep" TEXT NOT NULL,
    "end_rua" TEXT NOT NULL,
    "end_num" TEXT NOT NULL,
    "end_complem" TEXT NOT NULL,
    "end_bairro" TEXT NOT NULL,
    "end_cidade" TEXT NOT NULL,
    "end_uf" TEXT NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("end_id")
);

-- CreateTable
CREATE TABLE "ContaBancaria" (
    "contaBanc_id" SERIAL NOT NULL,
    "contaBanc_agencia" INTEGER NOT NULL,
    "contaBanc_conta" TEXT NOT NULL,
    "contaBanc_senhatransacao" TEXT NOT NULL,
    "contaBanc_tipo" TEXT NOT NULL,
    "contaBanc_saldo" DOUBLE PRECISION NOT NULL,
    "contaBanc_status" TEXT NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContaBancaria_pkey" PRIMARY KEY ("contaBanc_id")
);

-- CreateTable
CREATE TABLE "Transferencia" (
    "trans_id" SERIAL NOT NULL,
    "usuId_remetente" INTEGER NOT NULL,
    "usuId_destinatario" INTEGER NOT NULL,
    "trans_valor" DOUBLE PRECISION NOT NULL,
    "trans_descricao" TEXT NOT NULL,
    "trans_status" TEXT NOT NULL,
    "trans_metodo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transferencia_pkey" PRIMARY KEY ("trans_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_email_key" ON "Usuario"("usuario_email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_cpf_key" ON "Usuario"("usuario_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "ContaBancaria_usuario_id_key" ON "ContaBancaria"("usuario_id");

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContaBancaria" ADD CONSTRAINT "ContaBancaria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_usuId_remetente_fkey" FOREIGN KEY ("usuId_remetente") REFERENCES "ContaBancaria"("contaBanc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_usuId_destinatario_fkey" FOREIGN KEY ("usuId_destinatario") REFERENCES "ContaBancaria"("contaBanc_id") ON DELETE RESTRICT ON UPDATE CASCADE;
