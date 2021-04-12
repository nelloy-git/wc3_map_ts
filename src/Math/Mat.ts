// import { Logger } from '../Utils/Logger'

// let Log = Logger.Default

export class Mat {
    constructor(cols: number, rows: number, data: number[][]){
        if (data.length != rows){
            throw(Mat.name + 
                    string.format(': wrong size of input data. \n' + 
                                  'Input: [%d, %d]\n' + 
                                  'Data: [%d, %d]', cols, rows, data.length, data[1].length))
        }

        for (let row of data){
            if (row.length != cols){
                throw(Mat.name + 
                        ': wrong size of input data.')
            }
        }

        this.cols = cols
        this.rows = rows
        this.data = data
    }

    static sum(m1: Mat, m2: Mat){
        if (m1.cols != m2.cols || m1.rows != m2.rows){
            throw(Mat.name + 
                    ': m1.cols != m2.cols || m1.rows != m2.rows')
        }

        let data: number[][] = []
        for (let i = 0; i < m1.rows; i++){
            data.push([])
            for (let j = 0; j < m1.cols; j++){
                data[i][j] = m1.data[i][j] + m2.data[i][j]
            }
        }

        return new Mat(m1.cols, m1.rows, data)
    }

    static mult(m1: Mat, m2: Mat){
        if (m1.cols != m2.rows){
            throw(Mat.name + 
                    ': m1.cols != m2.rows')
        }

        let data: number[][] = []
        for (let i = 0; i < m1.rows; i++){
            data.push([])
            for (let j = 0; j < m2.cols; j++){
                data[i][j] = 0
                for (let k = 0; k < m1.cols; k++){
                    data[i][j] += m1.data[i][k] * m2.data[k][j]
                }
            }
        }
        return new Mat(m2.cols, m1.rows, data)
    }

    toString(){
        let res = 'Mat: [\n'
        for (let i = 0; i < this.rows; i++){
            res += '[' +  this.data[i][0].toString()
            for (let j = 1; j < this.cols; j++){
                res += ', ' + this.data[i][j].toString()
            }
            res += ']\n'
        }

        return res + ']'
    }

    data: number[][]
    readonly cols: number
    readonly rows: number
}