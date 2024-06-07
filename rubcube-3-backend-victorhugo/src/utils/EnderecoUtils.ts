export class EnderecoUtils{

    static cepRegex: RegExp = /^\d{5}-\d{3}$/
    static ruaRegex: RegExp = /^[A-Za-z].* [A-Za-z].*$/
    static bairroComplemRegex: RegExp = /^.*$/
    static numRegex: RegExp = /^[A-Za-z0-9].*$/
    static cidadeRegex: RegExp = /^[A-Za-zÀ-ÿ].*$/
    static ufRegex: RegExp = /^[A-Za-z]{2}$/
}

