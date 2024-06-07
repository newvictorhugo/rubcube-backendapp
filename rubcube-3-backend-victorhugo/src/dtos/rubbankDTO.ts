export interface AlterarEndIn {
    end_cep: string, 
    end_rua: string,
    end_num: string,
    end_complem: string,
    end_bairro: string,
    end_cidade: string,
    end_uf: string,
}

export interface AlterarEndOut {
    end_cep: string, 
    end_rua: string,
    end_num: string,
    end_complem: string,
    end_bairro: string,
    end_cidade: string,
    end_uf: string,
    usuario_id: number,
}

export interface AlterarSenhaApp {
    usuario_senha: string,
    usuario_senhanova: string,
    usuario_senhanovaconfirm: string
}

export interface AlterarSenhaTrans {
    contaBanc_senhatransacao: string
    contaBanc_senhatransacaonova: string
    contaBanc_senhatransacaonovaconfirm: string
}

