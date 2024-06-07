import { Atributo, Erro, HTTP_Codes, Tabela } from "dtos/errorDTO"


export class manipulaErros{

    private Erros: Erro[]

    constructor(){
        this.Erros = []
    }

    adicionaErro(tabela: Tabela, atributo: Atributo, codigo: HTTP_Codes, mensagem: string){
        if(codigo == 400 && mensagem==''){
            mensagem = atributo + ' inválido'
        }
        this.Erros.push({tabela, atributo, codigo, mensagem})
    }

    getErros(){
        return this.Erros
    }

    clearErros(){
        this.Erros = []
    }

}