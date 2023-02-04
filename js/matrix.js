class Matrix {
    #matrix 
    #matrixContainer
    #eqSystem
    #numLines

    constructor(numLines){
        this.#matrix = document.createElement('table')
        this.#matrixContainer = document.createElement('div')
        this.#matrixContainer.classList.add('matrix-container')
        this.#eqSystem = document.querySelector('.equation-system')

        this.#numLines = numLines
    }
    // Troca os operadores das variaveis X
    changeOperator(prevElem, curElem, numCells){
        if(prevElem){
            prevElem.innerHTML = `x<sub>${numCells-1}</sub> +`
        }
        curElem.innerHTML = `x<sub>${numCells}</sub> =`
    }

    createMatrix() {
        const NUM_LINES = this.#numLines
        for(let i = 0; i < NUM_LINES; i++) {
            const tr = document.createElement('tr')
            let lines = ''
            
            for(let j = 1; j <= NUM_LINES; j++){
                lines += `\n<td><input type="text" autofocus class="inputCell"></td>\n<td><span>x<sub>${j}</sub> +</span></td>`
                if(j == NUM_LINES) {
                    lines += '<td><input type="text" class="inputCell"></td>'
                    tr.innerHTML = lines
                }
            }

            const eqVariables = tr.querySelectorAll('span')
            const AMOUNT_VAR = eqVariables.length
            
            this.changeOperator(eqVariables[AMOUNT_VAR-2], eqVariables[AMOUNT_VAR-1], NUM_LINES)
            
            this.#matrix.appendChild(tr)
            this.#matrix.classList.add('matrix')
        }
        this.#matrixContainer.appendChild(this.#matrix)
        this.#eqSystem.insertAdjacentElement('beforeend', this.#matrixContainer)
    }

    addCells = () => {
        if(this.#numLines < 7){
            const trows = document.querySelectorAll('tr')
            const tr = document.createElement('tr')
            const td = document.createElement('td')
            let line = ''
            this.#numLines++
    
            // Add celulas as colunas
            trows.forEach(trow => {
                const tdInput = td.cloneNode(false)
                const tdVar = td.cloneNode(false)
                const span = document.createElement('span')
                const input = document.createElement('input')
                const previousSpan = trow.querySelectorAll('span')[this.#numLines-2]
                input.classList.add('inputCell')
                
                // trow.querySelectorAll('span')[this.#numLines-2].textContent = `x${this.#numLines-1} + `
                // span.textContent = `x${this.#numLines} =`
                this.changeOperator(previousSpan, span, this.#numLines)
    
                tdInput.appendChild(input)
                tdVar.appendChild(span)
                trow.append(tdVar, tdInput)
            })
        
            // Add linha
            for(let i = 1; i <= this.#numLines; i++){
                line += `\n<td><input type="text" class="inputCell"></td>\n<td><span>x<sub>${i}</sub> +</span>\n</td>`
                if(i == this.#numLines){
                    line += '<td><input type="text" class="inputCell"></td>'
                    tr.innerHTML = line
                }
            }

            const eqVariables = tr.querySelectorAll('span')
            const AMOUNT_VAR = eqVariables.length

            this.changeOperator(eqVariables[AMOUNT_VAR-2], eqVariables[AMOUNT_VAR-1], this.#numLines)
            this.#matrix.appendChild(tr)
        }
    }
    
    removeCells = () => {
        if(this.#numLines > 2){
            const tr = document.querySelectorAll('tr')
            this.#numLines--

            // Remove celulas das colunas
            tr.forEach(trow => {
                let lastCell = trow.lastChild
                let lastVariable = lastCell.previousSibling
                this.changeOperator(undefined, trow.querySelectorAll('span')[this.#numLines-1], this.#numLines)
                lastCell.remove()
                lastVariable.remove()
            })

            // Remove linha
            let lastTr = this.#matrix.lastChild
            lastTr.remove()
        }
    }
    
    resetCells(){
        document.querySelectorAll('td > input').forEach(input => input.value = '')
    }    

}

export default Matrix