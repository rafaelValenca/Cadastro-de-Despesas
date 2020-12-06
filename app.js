class Expense {
    constructor(year, month, day , type, description, value) {
        this.year = year
        this.month = month
        this.day = day
        this.type = type
        this.description = description
        this.value = value
    }

    validateData() { 
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
        let id = localStorage.getItem('id')// id != null and start 0
 
        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getNextId() {
        let NextId = localStorage.getItem('id')  
        return parseInt(NextId) + 1      //next ID, ID +1 = 1,2,3,4
    } 

    save(d) {
        let id = this.getNextId()        //save id 
        localStorage.setItem(id, JSON.stringify(d)) //converting para json
        localStorage.setItem('id', id)       // updating  id
    }
    

    //listing
    recoverAllRegister() {
        //array of Expenses
        let expenses = Array()

        let id = localStorage.getItem('id')
        //recovery all localstorage expenses
        for(let i = 1; i <= id; i++) {
            //recovery expenses
            let expense = JSON.parse(localStorage.getItem(i)) //convertendo de json para js

            //exist the possibility be indexes that were skipped
            if(expense === null) {
                continue
            }
            expense.id = i
            expenses.push(expense)
        }
        return expenses
    }

    //seacrch
    search(expense) {

        let expensesFilter = Array()
        expensesFilter = this.recoverAllRegister()

        //filters
        if(expense.year != ''){
       expensesFilter = expensesFilter.filter(d => d.year == expense.year)
        }
        if(expense.month != ''){
       expensesFilter =  expensesFilter.filter(d => d.month == expense.month)
        }
        if(expense.day != ''){
        expensesFilter = expensesFilter.filter(d => d.day == expense.day)
        }
        if(expense.type != ''){
       expensesFilter =  expensesFilter.filter(d => d.type == expense.type)
        }
        if(expense.description != ''){
        expensesFilter = expensesFilter.filter(d => d.description == expense.description)
        }
        if(expense.value != ''){
       expensesFilter =  expensesFilter.filter(d => d.value == expense.value)
        }
        
        return expensesFilter
    }

   remove(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function registerExpense() {
    let year = document.getElementById('year')  //get html field
    let month = document.getElementById('month')
    let day = document.getElementById('day')
    let type = document.getElementById('type')
    let description = document.getElementById('description')
    let value = document.getElementById('value')

    let expense = new Expense(  //get values
        year.value,
        month.value,
        day.value,
        type.value,
        description.value,
        value.value
    )
    
    //modal
    if(expense.validateData()) {
        bd.save(expense)    //saving expense on localstorage
        
        document.getElementById('modal_title').innerHTML = 'Registro inserido com sucesso'  //interal content
        document.getElementById('modal_title_div').className = 'modal-header text-success'
        document.getElementById('modal_content').innerHTML = 'Despesa foi cadastrada com sucesso'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'

        $('#modalRegisterExpense').modal('show') // jquery for show modal

        //cleaning up form after register
        year.value = ''
        month.value = ''
        day.value = ''
        type.value = ''
        description.value = ''
        value.value = ''
    
    } else {
        document.getElementById('modal_title').innerHTML = 'Erro na inclusão do registro'  
        document.getElementById('modal_title_div').className = 'modal-header text-danger'
        document.getElementById('modal_content').innerHTML = 'Erro na gravação'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'
        
        $('#modalRegisterExpense').modal('show')
    }
}  

//listing
function loadListExpenses(expenses = Array(), filter = false) {

    if(expenses.length == 0 && filter == false) {
        expenses = bd.recoverAllRegister()
    }
    //select element of table
    let listExpenses = document.getElementById("listExpenses")
    listExpenses.innerHTML = ''

 //llisting array dynamics
    expenses.forEach(function(d) {
        //tr
        let line = listExpenses.insertRow()

        //create cols (td)
        line.insertCell(0).innerHTML = `${d.day}/${d.month}/${d.year}`

        //adjust type
        switch(d.type) {
            case '1': d.type = 'alimentação'
                break
            case '2': d.type = 'Educação'
                break
            case '3': d.type = 'Lazer'
                break
            case '4': d.type = 'Saúde'
                break
            case '5': d.type = 'Transporte'
                break
        }

        line.insertCell(1).innerHTML = d.type
        line.insertCell(2).innerHTML = d.description
        line.insertCell(3).innerHTML = d.value

        //Delete btn
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fa fa-times"></i>'
        btn.id = `id_expense_${d.id}` 
        btn.onclick = function() {
            let id = this.id.replace('id_expense_', '')
            bd.remove(id)
            window.location.reload()
        }
        line.insertCell(4).append(btn)
        console.log(d)
    })
}

//search
function searchExpense() {
    let year = document.getElementById('year')
    let month = document.getElementById('month')
    let day = document.getElementById('day')
    let type = document.getElementById('type')
    let description = document.getElementById('description')
    let value = document.getElementById('value')
    
    let expense = new Expense(  //get values
        year.value,
        month.value,
        day.value,
        type.value,
        description.value,
        value.value
    )
    let expenses = bd.search(expense)

    this.loadListExpenses(expenses, true)

}
