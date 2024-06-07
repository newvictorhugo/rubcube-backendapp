
export enum HTTP_Codes {
    BadRequest = 400,
    Unaythorized = 401,
    ServerError = 500,
    Ok = 200,
    NotFound = 404
}

export enum Tabela {
    Usuario = "usuario",
    Endereco = "endereco",
    Conta = "conta",
    Transferencia = "transferencia"
}

export enum Atributo {
    id = "id",
    usu_nome = "Nome",
    usu_email = "Email",
    usu_senha = "Senha",
    usu_telefone = "Telefone",
    usu_cpf = "CPF",
    usu_dataNasc = "Data de Nascimento",
    end_cep = "CEP",
    end_rua = "Rua",
    end_num = 'Numero',
    end_complem = 'Complemento',
    end_bairro = 'Bairro',
    end_cidade = 'Cidade',
    end_uf = 'UF',
    contaBanc_senhatransacao = 'Senha Transacional',
    contaBanc_tipo = 'Tipo de conta',
    contaBanc_saldo = 'Saldo',
    trans_valor = 'Valor',
    trans_metodo = 'Metodo',
    trans_descricao = 'Descricao',
    usuId_destinatario = 'CPF de Destinatario',
    contaBanc_agencia = 'Agencia',
    contaBanc_conta = 'Número de conta',
    usu_senhanova = 'Senha nova',
    contaBanc_senhatransacaonova = 'Senha Transacional nova'
}

export interface Erro {
    atributo: Atributo;
    tabela: Tabela;
    codigo: HTTP_Codes;
    mensagem: string;
}