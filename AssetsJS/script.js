let listNum = [1,5,9,7,3,29,5,6]

function numMaior(listaDeNumeros){

    let maiorNumero = listaDeNumeros[0];
    for(let i = 0; i <= listaDeNumeros.length; i++){
        if(listaDeNumeros[i] > maiorNumero){
            maiorNumero = listaDeNumeros[i];
        }
    }
    return maiorNumero;
}
console.log(`O maior numero da minha lista é: ${numMaior(listNum)}`)