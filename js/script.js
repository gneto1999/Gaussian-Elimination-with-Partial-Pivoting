import Matrix from "./matrix.js"
import GaussianEliminationPartialPivoting from "./gaussianElimination.js"

const btnAddLinesAndCells = document.querySelector('#add-cells')
const btnDelLinesAndCells = document.querySelector('#remove-cells')
const btnResetLinesAndCells = document.querySelector('#reset-cells')
const btnSolveSystemEquation = document.querySelector('#solve')

const matrix = new Matrix(3)
matrix.createMatrix()
btnAddLinesAndCells.addEventListener('click', matrix.addCells)
btnDelLinesAndCells.addEventListener('click', matrix.removeCells)
btnResetLinesAndCells.addEventListener('click', matrix.resetCells)

const gaussWithPartialPivoting = new GaussianEliminationPartialPivoting
btnSolveSystemEquation.addEventListener('click', gaussWithPartialPivoting.buildingMatrix)