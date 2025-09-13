function somaDosImpares(numeros) {
    let soma = 0;
    for(let i = 0; i <= numeros; i++) {
        if(i % 2 !== 0) {
            soma += i;
        }
    }
    return soma;
} 

console.log("O valor da soma dos numeros Impares: " + somaDosImpares(5));

let listNumeros = [3,8,1,23,9,5];
function maiorNumero(listNumeros){
    let maior = listNumeros[0];
    for(let i = 0; i <= listNumeros.length; i++){
        if(listNumeros[i] > maior){
            maior = listNumeros[i];
        }
    }
    return maior;
}


console.log("O maior numero do ARRAY é: " + maiorNumero(listNumeros));