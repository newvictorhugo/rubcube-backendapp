import { DateTime } from "luxon";

export interface EnderecoIn {
    end_cep: string, 
    end_rua: string,
    end_num: string,
    end_complem: string,
    end_bairro: string,
    end_cidade: string,
    end_uf: string,
    usuario_id: number,
}

export interface EnderecoOut {
    end_id: number,
    end_cep: string
}