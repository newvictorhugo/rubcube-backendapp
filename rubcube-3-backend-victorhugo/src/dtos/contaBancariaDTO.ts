import { DateTime } from "luxon";

export interface ContaBancariaIn {
    
    contaBanc_agencia: number,
    contaBanc_conta: string,
    contaBanc_senhatransacao: string,
    contaBanc_tipo: string,
    contaBanc_saldo: number,
    contaBanc_status: string,
    usuario_id: number,
}

export interface ContaBancariaOut {
    contaBanc_id: number,
    contaBanc_agencia: number,
    contaBanc_conta: string,
    contaBanc_tipo: string,
    contaBanc_saldo: number,
}
