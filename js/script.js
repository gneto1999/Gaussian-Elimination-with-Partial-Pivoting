const MATRIX = document.createElement('table')
const MATRIX_CONTAINER = document.createElement('div')
MATRIX_CONTAINER.classList.add('matrix-container')
const EQ_SYS = document.querySelector('.equation-system')

const BTN_ADD_CELLS = document.querySelector('#add-cells')
const BTN_REM_CELLS = document.querySelector('#remove-cells')
const BTN_RESET_CELLS = document.querySelector('#reset-cells')
const BTN_SOLVE = document.querySelector('#solve')

let numCells = 3;

function changeOperator(prevElem, curElem, numberEqt){
    if(prevElem){
        prevElem.textContent = `x${numberEqt-1}+`
    }
    curElem.textContent = `x${numberEqt}=`
}

function createMatrix(numberEqt) {
    for(i = 0; i < numberEqt; i++) {
        const TR = document.createElement('tr')
        let lines = ''

        for(j = 1; j <= numberEqt; j++){
            lines += `\n<td><input type="text"></td>\n<td><span>x${j}+</span></td>`
            if(j == numberEqt) {
                lines += '<td><input type="text"></td>'
                TR.innerHTML = lines
            }
        }

        changeOperator(TR.querySelectorAll('span')[1], TR.querySelectorAll('span')[2], numberEqt)

        MATRIX.appendChild(TR)
        MATRIX.classList.add('matrix')
        MATRIX_CONTAINER.appendChild(MATRIX)
        EQ_SYS.insertBefore(MATRIX_CONTAINER, document.querySelector('#solve'))
    }
}

function addCells(){
    if(numCells < 10){
        const TROWS = document.querySelectorAll('tr')
        const TR = document.createElement('tr')
        const TD = document.createElement('td')
        let line = ''
        numCells++

        // Add celulas as colunas
        TROWS.forEach(trow => {
            const TD_INPUT = TD.cloneNode(false)
            const TD_VAR = TD.cloneNode(false)
            const SPAN = document.createElement('span')
            const INPUT = document.createElement('input')
            
            trow.querySelectorAll('SPAN')[numCells-2].textContent = `x${numCells-1}+`
            SPAN.textContent = `x${numCells}=`
            
            changeOperator(trow.querySelectorAll('SPAN')[numCells-2], SPAN, numCells)

            TD_INPUT.appendChild(INPUT)
            TD_VAR.appendChild(SPAN)
            trow.append(TD_VAR, TD_INPUT)
        })
    
        // Add linha
        for(i = 1; i <= numCells; i++){
            line += `<td><input type="text"></td><td><span>x${i}+</span></td>`
            if(i == numCells){
                line += '<td><input type="text"></td>'
            }
        }

        TR.innerHTML = line

        changeOperator(TR.querySelectorAll('span')[numCells-2], TR.querySelectorAll('span')[numCells-1], numCells)
        MATRIX.appendChild(TR)
    }
}

function removeCells(){
    if(numCells > 2){
        const TR = document.querySelectorAll('tr')
        numCells--
        // Remove celulas das colunas
        TR.forEach(trow => {
            let lastCell = trow.lastChild
            let lastVariable = lastCell.previousSibling
            changeOperator(undefined, trow.querySelectorAll('span')[numCells-1], numCells)
            lastCell.remove()
            lastVariable.remove()
        })
        // Remove linha
        let lastTr = MATRIX.lastChild
        lastTr.remove()
    }
}

function resetCells(){
    document.querySelectorAll('td > input').forEach(input => input.value = '')
}

BTN_ADD_CELLS.addEventListener('click', addCells)
BTN_REM_CELLS.addEventListener('click', removeCells)
BTN_RESET_CELLS.addEventListener('click', resetCells)

createMatrix(numCells)

// Gauss elimination with pivoting partial
function gaussPivotingPartial(){
    const inputs = Array.from(document.querySelectorAll('td > input'))
    const rowsNumberMatrix = document.querySelectorAll('table > tr').length
    const matrixU = []
    const vectorSolution = []
    let lineIndice = 0, aux, multipliers
    // const matrixA = [[1, -1, 2, 2], [2, -2, -1, 4], [-2, -5, 3, 3]]
    // const matrixA = [[1, 1, 1, 1], [2, 1, -1, 0], [2, 2, 1, 1]]
    // const matrixA = [[2, 1, 1, 0, 1], [4, 3, 3, 1, 2], [8, 7, 9, 5, 4], [6, 7, 9, 8, 5]]
    
    for(let i = 0; i < rowsNumberMatrix; i++){
        let arr = []
        for(let j = i*(rowsNumberMatrix+1); j < (i+1)*(rowsNumberMatrix+1); j++){
            arr.push(Number(inputs[j].value))
        }
        matrixU.push(arr)
    }
    
    // const matrixU = [...matrixA]
    const N = matrixU.length

    for(let k = 0; k < N; k++){
        let maxPivot = 0
        for(let j = k; j < N; j++){
            if(Math.abs(matrixU[j][k]) > maxPivot){
                maxPivot = matrixU[j][k];
                lineIndice = j;
            }
        }
        
        if(lineIndice !== k){
            aux = matrixU[k]
            matrixU[k] = matrixU[lineIndice]
            matrixU[lineIndice] = aux
        }     
        
        for(let j = k+1; j < N; j++){
            multipliers = matrixU[j][k]/matrixU[k][k]
            for(let i = 0; i < N+1; i++){
                matrixU[j][i] -= multipliers*matrixU[k][i]
            }
        }
    }
    
    vectorSolution[N-1] = Number((matrixU[N-1][N] / matrixU[N-1][N-1]).toFixed(15))
    for(let i = N-2; i >= 0; i--){
        let sum = 0
        for(let j = i+1; j < N; j++){
            sum += matrixU[i][j]*vectorSolution[j]
        }
        vectorSolution[i] = (matrixU[i][N] - sum)/matrixU[i][i]
    }
    console.log(matrixU)
    console.log(vectorSolution)
}

BTN_SOLVE.addEventListener('click', gaussPivotingPartial)