/* Referências:
    Classes JavaScript: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes
    Objeto Date e Timestamp: https://pt.stackoverflow.com/questions/544/como-obter-o-timestamp-em-javascript
*/

/* Importacoes */
const fs = require('fs')

class RegistroINMET{
    constructor(data, temp_min, temp_max, temp_med_min, temp_med_max, temp_med){
        this.data = data; // formato: 'dd/mm/yyyy'
        data = data.split("/");
        
        this.dia = data[0];
        this.mes = data[1];
        this.ano = data[2];

        this.temp_min = temp_min;
        this.temp_max = temp_max;

        this.temp_med_min = temp_med_min;
        this.temp_med_max = temp_med_max;
        this.temp_med = temp_med;

        this.timestamp = new Date(this.ano, this.mes - 1, this.dia).getTime();
    }

    agrupar_maior_valor(novo_registro, chave){
        this[chave] < novo_registro[chave] ? this[chave] = novo_registro[chave] : "pass";
    }

    agrupar_menor_valor(novo_registro, chave){
        this[chave] > novo_registro[chave] ? this[chave] = novo_registro[chave] : "pass";
    }

    agrupar_media(novo_registro, chave){
        let media = ((this[chave] + novo_registro[chave])/2).toFixed(1) - 0;
        this[chave] = media;
    }

    agruparRegistro(novo_registro){
        this.agrupar_menor_valor(novo_registro, "temp_min");
        this.agrupar_maior_valor(novo_registro, "temp_max");
        this.agrupar_media(novo_registro, "temp_med_min");
        this.agrupar_media(novo_registro, "temp_med_max");
        this.agrupar_media(novo_registro, "temp_med");
    }

    exibirRegistro(){
        const string_registro_formatada = "["
                            + "Data: " + this.data
                            + "; " + "Temp_Min: " + this.temp_min
                            + "; " + "Temp_Max: " + this.temp_min
                            + "]";
        console.log(string_registro_formatada)
    }
}

class EstacaoMeteorologica{
    timestampParaData(valor_timestamp){
        let data_temporaria = new Date(valor_timestamp).toISOString();
        let ano_valor = data_temporaria.slice(0, 4);
        let mes_valor = data_temporaria.slice(5, 7);
        let dia_valor = data_temporaria.slice(8, 10);
        let data_formatada = dia_valor + "/" + mes_valor + "/" + ano_valor;
        return data_formatada;
    }

    /* Retorna a posicao da primeira ocorrencia 
    do registro com a data especificada,
    caso nao haja retorna -1 */
    buscarRegistroPorData(arrayRegistros, data){
        for(let i=0; i<arrayRegistros.length;i++){
            if(arrayRegistros[i].data === data){
                return i;
            }
        }
        return -1;
    }

    /* Retorna a posicao da primeira ocorrencia 
    do registro com o timestamp especificado,
    caso nao haja retorna -1 */
    buscarRegistroPorTimestamp(arrayRegistros, timestamp){
        let data_registro = new Date(timestamp * 1000) // milisegundos
        //let data_formatada =
        return this.buscarRegistroPorData(arrayRegistros)
    }

    /* Agrupa as informacoes de um registro na sua respectiva
    posicao em um arrayRegistros, caso nao tenha ocorrencia,
    insere o novo registro no array. Chave e 'data'*/
    inserirRegistroAgrupando(arrayRegistros, registro){
        let pos_registro = this.buscarRegistroPorData(arrayRegistros, registro.data);
        if(pos_registro == -1){
            arrayRegistros.push(registro);
            return;
        }
        arrayRegistros[pos_registro].agruparRegistro(registro);
        // processamento de insercao e agrupamento
    }

    swap_registro(arrayRegistros, pos_reg1, pos_reg2){
        let aux = arrayRegistros[pos_reg1];
        arrayRegistros[pos_reg1] = arrayRegistros[pos_reg2];
        arrayRegistros[pos_reg2] = aux;
    }

    /* Retorna True se 'registro1[chave]' e 'registro2[chave]'
    preservam a 'ordem' preestipulada.
    registro1[chave] < registro2[chave], 'asc'  --> True
    registro1[chave] < registro2[chave], 'desc' --> False
    registro1[chave] > registro2[chave], 'asc'  --> False
    registro1[chave] > registro2[chave], 'desc'  --> True */
    comparar_chaves_registros(registro1, registro2, chave, ordem){
        let resultado_ordem = registro1[chave] < registro2[chave] ? true : false;
        if(ordem == "asc"){
            return resultado_ordem;
        }else{
            return !resultado_ordem;
        }
    }

    particiona_chave_ordem(arrayRegistros, pos_a, pos_b, chave, ordem){
        let pos_pivot = pos_b;
        let pivot = arrayRegistros[pos_pivot];
        let i = pos_a;
        let j = pos_b-1;

        while(i < j){
            
            while(this.comparar_chaves_registros(arrayRegistros[i], arrayRegistros[pos_pivot], chave, ordem) && i < j){
                i++;
            }
            console.log("Saiu do laço while 'i': (i,J) ("+i+","+j+"); "+arrayRegistros[i][chave]+", "+arrayRegistros[j][chave]);
            if (i == j){
                break;
            }
            
            
            while(this.comparar_chaves_registros(arrayRegistros[pos_pivot], arrayRegistros[j], chave, ordem) && i < j){
                j--;
            }
            console.log("Saiu do laço while 'j': (i,j) ("+i+","+j+"); "+arrayRegistros[i][chave]+", "+arrayRegistros[j][chave]);
            if (i == j){
                break;
            }
            
            console.log("Trocando: "+arrayRegistros[i][chave]+" por: "+arrayRegistros[j][chave]);
            this.swap_registro(arrayRegistros, i, j);
        }

        // se vetor[pos_pivot] ordem vetor[j], troca
        if(this.comparar_chaves_registros(arrayRegistros[pos_pivot], arrayRegistros[i], chave, ordem)){
            console.log("Troca Pivot pos_pivot por pos_i: "+arrayRegistros[pos_pivot][chave]+" por : "+arrayRegistros[i][chave]);
            this.swap_registro(arrayRegistros, i, pos_pivot);
            console.log("Resultado particiona: i: "+i+" j: "+j+" pos_pivot: "+pos_pivot);
            console.log()
            return i;
        }
        return pos_pivot;
    }

    quicksort_chave_ordem(arrayRegistros, pos_a, pos_b, chave, ordem){
        console.log(pos_a);
        console.log(pos_b);
        console.log(arrayRegistros)
        if(pos_a >= pos_b){
            return;
        }
        let meio = this.particiona_chave_ordem(arrayRegistros, pos_a, pos_b, chave, ordem);
        this.quicksort_chave_ordem(arrayRegistros, pos_a, meio-1, chave, ordem);
        this.quicksort_chave_ordem(arrayRegistros, meio+1, pos_b, chave, ordem);
    }

    ordenar_arrayRegistros(arrayRegistros, chave, ordem){
        if(ordem != "desc"){
            ordem = "asc";
        }
        pos_a = 0;
        pos_b = arrayRegistros.length-1;
        quicksort_chave_ordem(arrayRegistros, pos_a, pos_b, chave, ordem);
    }

    principal(){
        const DELIMITADOR_REGISTRO = '\n';
        const DELIMITADOR_COLUNA = ';';
        const CODIFICACAO = 'utf-8';
        const LISTA_ARQUIVOS_INMET = "lista_arquivos_inmet.txt";

        const DATA = 0, TEMP_MAX = 1, TEMP_MIN = 2, CHUVA = 3;
        const ROTULO = [DATA, TEMP_MAX, TEMP_MIN, CHUVA];

        // Codigos em hardcode, mas poderiam ser passados por arg parse ou .cfg
        const path_arquivos_inmet = "dados_mensais_inmet/";
        const lista_arquivos_inmet = fs.readFileSync(LISTA_ARQUIVOS_INMET);

        // Lista de Registros Diarios Unicos de 2021
        const regs_unicos_2021 = [];

        let registro1 = new RegistroINMET('01/10/1995', 12.5, 28.3, 22.5, 25.3, 23.9);
        let registro2 = new RegistroINMET('02/10/1995', 10, 30, 10, 10, 15);
        let registro3 = new RegistroINMET('02/10/1995', 5, 20, 20, 30, 16);
        let registro4 = new RegistroINMET('03/10/1995', 4.2, 26.3, 22.5, 25.3, 23.9);
        let registro5 = new RegistroINMET('04/10/1995', 11.4, 23.3, 22.5, 25.3, 23.9);

        this.inserirRegistroAgrupando(regs_unicos_2021, registro1);
        this.inserirRegistroAgrupando(regs_unicos_2021, registro2);
        this.inserirRegistroAgrupando(regs_unicos_2021, registro3);
        this.inserirRegistroAgrupando(regs_unicos_2021, registro4);
        this.inserirRegistroAgrupando(regs_unicos_2021, registro5);
        
        //console.log(regs_unicos_2021);
        //console.log()
        
        this.swap_registro(regs_unicos_2021, 0, 3);
        //console.log(regs_unicos_2021);
        //console.log();

        this.swap_registro(regs_unicos_2021, 2, 3);
        console.log(regs_unicos_2021);
        console.log();

        console.log(this.comparar_chaves_registros(registro1, registro2, "temp_max", "asc"));
        console.log();

        /*
        let chave = "timestamp";
        let ordem = "asc";
        this.quicksort_chave_ordem(regs_unicos_2021, 0, regs_unicos_2021.length-1, chave, ordem);
        console.log(regs_unicos_2021);
        console.log();
        */

        let chave = "data";
        let ordem = "asc";
        //this.quicksort_chave_ordem(regs_unicos_2021, 0, regs_unicos_2021.length-1, chave, ordem);
        //this.particiona_chave_ordem(regs_unicos_2021, 0, regs_unicos_2021.length-1, chave, ordem);
        //this.particiona_chave_ordem(regs_unicos_2021, 0, regs_unicos_2021.length-1, chave, ordem);
        this.quicksort_chave_ordem(regs_unicos_2021, 0, regs_unicos_2021.length-1, chave, ordem);
        console.log(regs_unicos_2021);
        console.log();
    }
    

}

estacaoMeteorologica = new EstacaoMeteorologica()
estacaoMeteorologica.principal()