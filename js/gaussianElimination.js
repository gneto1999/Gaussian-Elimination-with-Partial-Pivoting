class GaussianEliminationPartialPivoting {
    #matrixU

    buildingMatrix = () => {
        this.#matrixU = []
        // this.#matrixU = [[8, 6, -1, 0], [2, 1, 1, 3], [6, 9, -5, -13]]
        // this.#matrixU = [[1, -1, 2, 2], [2, -2, -1, 4], [-2, -5, 3, 3]]
        // this.#matrixU = [[1, 1, 1, 3], [2, -1, 3, 4], [5, 3, -6, 2]]
        // this.#matrixU = [[2, 3, 1, 1, 7], [4, 7, 4, 3, 1], [4, 7, 6, 4, 4], [6, 9, 9, 8, 12]]
        const inputs = document.querySelectorAll('td > input')
        const rowsNumberMatrix = document.querySelectorAll('table > tr').length

        for(let i = 0; i < rowsNumberMatrix; i++){
            let arr = []
            for (let j = i * (rowsNumberMatrix + 1); j < (i + 1) * (rowsNumberMatrix + 1); j++) {
                arr.push(Number(inputs[j].value))
            }
            this.#matrixU.push(arr)
        }
        
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
            // Escolha do max pivot
            for(let j = k; j < N; j++){
                if(Math.abs(this.#matrixU[j][k]) > Math.abs(maxPivot)){
                    maxPivot = this.#matrixU[j][k];
                    lineIndex = j;
                }
            }
            // Troca de linhas entre a linha com max pivot e a Linha com a iterção k
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
            
            // Escolha dos múltiplicadores das linhas e escalonamento da matriz
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

        // Formatando a matriz no formato Latex/Katex
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
        
        results.forEach((result, i) => {
            if(i < results.length-2){
                strHtmlResults += `
                    <div class="results">
                    <div>max pivot: $${result.maxPivot}$</div>
                    <div>$L_${i+1} \\leftrightarrows L_${result.lineIndex+1}$</div>
                    <div>$\\begin{bmatrix}${matrixJsToMatrixKatex(result.swapMatrix)}\\end{bmatrix}$</div>
                    `
                result.multipliers.forEach((mult, j) =>{
                    if(mult !== undefined){
                        strHtmlResults += `<div>$m_${result.multipliersLines[j]}$$_${i+1}$: $${mult}$</div>`
                    }
                })

                result.multipliers.forEach((multi, j) =>{
                    if(multi !== undefined){
                        strHtmlResults += `<div>$L_${result.multipliersLines[j]} = L_${result.multipliersLines[j]} \\times (${multi})L_${i+1}$</div>`
                    }
                })

                strHtmlResults += `
                    <div>$\\begin{bmatrix}${matrixJsToMatrixKatex(result.matrixUResult)}\\end{bmatrix}$</div></div>
                `
            } else if(result.length){
                strHtmlResults += `<div id="vectorSolution" class="results">
                $x = \\begin{bmatrix}${Array.from(result).join(',').replaceAll(',', String.raw`\\`)}\\end{bmatrix}$
                </div>`
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

export default GaussianEliminationPartialPivoting