import { DateTime } from "luxon";

export interface TransferenciaIn {
    usuId_remetente: number,
    usuId_destinatario: number,
    trans_valor: number,
    trans_descricao: string,
    trans_status: string,
    trans_metodo: string,
}

export interface TransferenciaOut {
    trans_id: number,
    usuId_remetente: number,
    usuId_destinatario: number,
    trans_valor: number,
    trans_descricao: string,
    trans_status: string,
    trans_metodo: string,
}