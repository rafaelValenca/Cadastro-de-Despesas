class Despesa {
    constructor(ano, mes, dia , tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() { // validando dados
        for(let i in this) {
           if(this[i] == undefined || this[i] == '' || this[i] == null) { //return false
               return false
           }
        }
        return true
    }
}

class Bd {

    constructor() {    
        let id = localStorage.getItem('id')//pro id ser difetente de null e começar como 0
 
        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')  
        return parseInt(proximoId) + 1      //priximo ID, ID +1 par vim 1,2,3,4
    } 

    gravar(d) {
        let id = this.getProximoId()        //gravando id 
        localStorage.setItem(id, JSON.stringify(d)) //convertendo para json
        localStorage.setItem('id', id)       // atualizando o id
    }
    

    //LISTAGEM
    recuperarTodosRegistros() {
        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')
        //recuperar todas as despesas do localstorage
        for(let list = 1; list <= id; list++) {
            //recuperar despesas
            let despesa = JSON.parse(localStorage.getItem(list)) //convertendo de json para js

            //existe a possibiçidade de haver indices que foram pulados
            if(despesa === null) {
                continue
            }

            despesas.push(despesa)
        }
        return despesas
    }

    //PESQUISA
    pesquisar(despesa) {

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        
        console.log(despesa)
        console.log(despesasFiltradas)

        //filtros
        if(despesa.ano != ''){
       despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        if(despesa.mes != ''){
       despesasFiltradas =  despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if(despesa.dia != ''){
        despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if(despesa.tipo != ''){
       despesasFiltradas =  despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if(despesa.descricao != ''){
        despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if(despesa.valor != ''){
       despesasFiltradas =  despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        
        return despesasFiltradas
    }
}

let bd = new Bd()

function cadastraDespesa() {
    let ano = document.getElementById('ano')  //pegando campos do html
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(  //pegando valores
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    
    //modal
    if(despesa.validarDados()) {
        bd.gravar(despesa)    //gravando despesa no localstorage
        
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'  //conteudo interno
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'

        $('#RegistraDespesa').modal('show') // jquery para mostrar o modal

        //limpando form apos cadastrar
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    
    } else {
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'  //inner html conteudo interno
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'
        
        $('#RegistraDespesa').modal('show')
    }
}  

//LISTAGEM
function carregarListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }
    //selecionando elemnto da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

 //percorrer o array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function(d) {
        //tr
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //ajustar o tipo
        switch(d.tipo) {
            case '1': d.tipo = 'alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

    })
}

//PESQUISA
function pesquisarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')
    
    let despesa = new Despesa(  //pegando valores
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    let despesas = bd.pesquisar(despesa)

    this.carregarListaDespesas(despesas, true)

}
