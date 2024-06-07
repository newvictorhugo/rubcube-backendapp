import { EnderecoIn } from "./enderecoDTO"
import { ContaBancariaIn } from "./contaBancariaDTO"

export interface UsuarioIn {
    usuario_nome: string,
    usuario_email: string,
    usuario_senha: string,
    usuario_tel: string,
    usuario_cpf: string,
    usuario_dtNascimento: Date,
    // endereco: EnderecoIn,
    // conta: ContaBancariaIn
}

export interface UsuarioOut {
    usuario_id: number,
    usuario_email: string,
    usuario_nome: string
    usuario_tel: string
}

export interface AlterarUsuario {
    usuario_nome: string,
    usuario_email: string,
    usuario_tel: string,
    usuario_dtNascimento: Date,
}
