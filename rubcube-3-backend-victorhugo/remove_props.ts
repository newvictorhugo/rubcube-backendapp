function RemoveProps(objeto: any, chaves: string[]) {

    chaves.forEach(chave => {
        Reflect.deleteProperty(objeto, chave);
    })
}

const usuarioRetornado = {
    nome: "Victor",
    email: "victor@mail.com",
    senha: '122131',
    saldo: 300
}


console.info(usuarioRetornado);

RemoveProps(usuarioRetornado, ['senha', 'saldo']);

console.info(usuarioRetornado);