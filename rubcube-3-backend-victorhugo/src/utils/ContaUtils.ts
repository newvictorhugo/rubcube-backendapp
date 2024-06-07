

export class ContaUtils{

    static contaBanc_agencia: RegExp = /^\d{3}$/
    static contaBanc_conta: RegExp = /^\d{8}$/ //string 
    static contaBanc_senhatran: RegExp = /^\d{4}$/
    static contaBanc_tipo: RegExp = /^(?!\s)[A-Za-z].*$/
    static contaBanc_saldo: RegExp = /^\d.*$/
    static contaBanc_status: RegExp = /^[A-Za-z].*$/

    static validarsenha(senha: any): boolean {
        return this.contaBanc_senhatran.test(senha)
    }

    static validarSenhaTrans(senha: any){

        if(this.validarsenha(senha)){
            const numeros = senha.split("")
            let contSq = 0
            let contRp = 0

            for(let i=0;i<numeros.length;i++){
                const numerosSenha = parseInt(numeros[i])
                if(numerosSenha-1 == parseInt(numeros[i-1])){
                    contSq++
                }
                if(numerosSenha == parseInt(numeros[i+1])){
                    contRp++
                }
            }
            if(contSq == 3 || contRp == 3){
                return false
            }else{
                return this.contaBanc_senhatran.test(senha)
            }
        }
    }
}