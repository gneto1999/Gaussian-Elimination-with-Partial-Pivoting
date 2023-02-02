const btnAddLinesAndCells = document.querySelector('#add-cells')
const btnDelLinesAndCells = document.querySelector('#remove-cells')
const btnResetLinesAndCells = document.querySelector('#reset-cells')
const btnSolveSystemEquation = document.querySelector('#solve')

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

            this.changeOperator(tr.querySelectorAll('span')[1], tr.querySelectorAll('span')[2], NUM_LINES)
            
            this.#matrix.appendChild(tr)
            this.#matrix.classList.add('matrix')
        }
        this.#matrixContainer.appendChild(this.#matrix)
        // this.#eqSystem.insertBefore(this.#matrixContainer, document.querySelector('#solve'))
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
                input.classList.add('inputCell')
                
                trow.querySelectorAll('span')[this.#numLines-2].textContent = `x${this.#numLines-1} + `
                span.textContent = `$x_${this.#numLines} = $`
                
                this.changeOperator(trow.querySelectorAll('span')[this.#numLines-2], span, this.#numLines)
    
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

            this.changeOperator(tr.querySelectorAll('span')[this.#numLines-2], tr.querySelectorAll('span')[this.#numLines-1], this.#numLines)
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

class gaussEliminationPartialPivoting {
    #matrixU

    buildingMatrix = () => {
        this.#matrixU = []
        // this.#matrixU = [[8, 6, -1, 0], [2, 1, 1, 3], [6, 9, -5, -13]]
        // this.#matrixU = [[1, -1, 2, 2], [2, -2, -1, 4], [-2, -5, 3, 3]]
        // this.#matrixU = [[1, 1, 1, 3], [2, -1, 3, 4], [5, 3, -6, 2]]
        this.#matrixU = [[2, 3, 1, 1, 7], [4, 7, 4, 3, 1], [4, 7, 6, 4, 4], [6, 9, 9, 8, 12]]
        // const inputs = document.querySelectorAll('td > input')
        // const rowsNumberMatrix = document.querySelectorAll('table > tr').length

        // for(let i = 0; i < rowsNumberMatrix; i++){
        //     let arr = []
        //     for (let j = i * (rowsNumberMatrix + 1); j < (i + 1) * (rowsNumberMatrix + 1); j++) {
        //         arr.push(Number(inputs[j].value))
        //     }
        //     this.#matrixU.push(arr)
        // }
        
        this.#scalingMatrix()
    }

    #scalingMatrix(){
        const N = this.#matrixU.length
        const results = []
        const originalMatrix = JSON.parse(JSON.stringify(this.#matrixU))
        let lineIndex, aux, multipliers
        for(let k = 0; k < N; k++){
            const scallingProcess = {}
            let maxPivot = 0

            for(let j = k; j < N; j++){
                if(Math.abs(this.#matrixU[j][k]) > Math.abs(maxPivot)){
                    maxPivot = this.#matrixU[j][k];
                    lineIndex = j;
                }
            }
 
            if(lineIndex !== k){
                aux = this.#matrixU[k]
                this.#matrixU[k] = this.#matrixU[lineIndex]
                this.#matrixU[lineIndex] = aux
            }     
            
            scallingProcess.maxPivot = maxPivot
            scallingProcess.lineIndex = lineIndex
            scallingProcess.swapMatrix = JSON.parse(JSON.stringify(this.#matrixU))
            scallingProcess.multipliers = []
            scallingProcess.multipliersLines = []
            
            for(let j = k+1; j < N; j++){
                multipliers = this.#matrixU[j][k]/this.#matrixU[k][k]

                scallingProcess.multipliers.push(multipliers)
                scallingProcess.multipliersLines.push(j+1)

                for(let i = 0; i < N+1; i++){
                    this.#matrixU[j][i] -= multipliers*this.#matrixU[k][i]
                }
            }

            scallingProcess.matrixUResult = JSON.parse(JSON.stringify(this.#matrixU))
            results.push(scallingProcess)
        }
        results[0].original = originalMatrix
        console.log(results)
        this.#solution(N, results)
    }

    #solution(N, results){
        const matrixU = this.#matrixU
        const vectorSolution = []
        vectorSolution[N-1] = Number((matrixU[N-1][N] / matrixU[N-1][N-1]).toFixed(15))
        for(let i = N-2; i >= 0; i--){
            let sum = 0
            for(let j = i+1; j < N; j++){
                sum += matrixU[i][j]*vectorSolution[j]
            }
            vectorSolution[i] = (matrixU[i][N] - sum)/matrixU[i][i]
        }
        results.push(vectorSolution)
        this.#displayResult(results)
    }
    
    #displayResult(results){        
        const eqSystem = document.querySelector('.equation-system')
        const resultsContainer = document.createElement('div')
        resultsContainer.classList.add('resultsContainer')

        function matrixJsToMatrixKatex(mtx){
            let str = ''
            mtx.forEach(m => {
                str += m.join(',')
                str = str.replaceAll(',', '&').split('')
                str.push(String.raw`\\`)
                str = str.join('')
            })
            return str
        }
        
        let strHtmlResults = ''
        strHtmlResults += `<div id="original-matrix" class="results">
        <div>$\\begin{bmatrix}${matrixJsToMatrixKatex(results[0].original)}\\end{bmatrix}$</div>
        </div>`
        
        results.forEach((r, i) => {
            if(i < results.length-2){
                strHtmlResults += `
                    <div class="results">
                    <div>max pivô: $${r.maxPivot}$</div>
                    <div>$L_${i+1} \\leftrightarrows L_${r.lineIndex+1}$</div>
                    <div>$\\begin{bmatrix}${matrixJsToMatrixKatex(r.swapMatrix)}\\end{bmatrix}$</div>
                    `
                r.multipliers.forEach((mult, j) =>{
                    if(mult !== undefined){
                        strHtmlResults += `<div>$m_${r.multipliersLines[j]}$$_${i+1}$: $${mult}$</div>`
                    }
                })

                r.multipliers.forEach((multi, j) =>{
                    if(multi !== undefined){
                        strHtmlResults += `<div>$L_${r.multipliersLines[j]} = L_${r.multipliersLines[j]} \\times (${multi})L_${i+1}$</div>`
                    }
                })

                strHtmlResults += `
                    <div>$\\begin{bmatrix}${matrixJsToMatrixKatex(r.matrixUResult)}\\end{bmatrix}$</div></div>
                `
            } else if(r.length){
                strHtmlResults += `<div id="vectorSolution" class="results">$x = \\begin{bmatrix}${Array.from(r).join(',').replaceAll(',', String.raw`\\`)}\\end{bmatrix}$</div>`
            }
        })

        resultsContainer.innerHTML = strHtmlResults

        if(eqSystem.lastElementChild === document.querySelector('.resultsContainer')){
            eqSystem.lastElementChild.remove()
        }
        document.querySelector('.equation-system').insertAdjacentElement('beforeend', resultsContainer)

        renderMathInElement(resultsContainer, {
            delimiters: [{left: '$', right: '$', display: false}],
            throwOnError : false
        })
    }
}

const matrix = new Matrix(3)
matrix.createMatrix()
btnAddLinesAndCells.addEventListener('click', matrix.addCells)
btnDelLinesAndCells.addEventListener('click', matrix.removeCells)
btnResetLinesAndCells.addEventListener('click', matrix.resetCells)

const gaussWithPartialPivoting = new gaussEliminationPartialPivoting
btnSolveSystemEquation.addEventListener('click', gaussWithPartialPivoting.buildingMatrix)