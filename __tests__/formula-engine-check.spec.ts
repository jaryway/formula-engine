import { FormulaEngine } from '../src/index'
describe('Engine-chech', () => {
  const engine = new FormulaEngine('check')
  function assertReult(formula: string, params: any, validOk = false) {
    if (validOk) {
      expect(() => engine.exec(formula, params)).not.toThrowError()
    } else {
      expect(() => engine.exec(formula, params)).toThrowError()
    }
  }

  describe('验证表达式是否合法', () => {
    const items: [string, any, boolean][] = [
      ['IF({fieldNngOvnB1691577869405}>90,"sdfsd","sdfsd")', { fieldNngOvnB1691577869405: 'date' }, true],
      ['SUM({fieldNngOvnB1691577869405},120)', { fieldNngOvnB1691577869405: 'date' }, false],
      ['SUM({fieldNngOvnB1691577869405},120)', { fieldNngOvnB1691577869405: 'number' }, true],
      ['SUM(LLL)IF({fieldNngOvnB1691577869405}>90,"sdfsd","sdfsd")', { fieldNngOvnB1691577869405: 'date' }, false]
    ]

    items.forEach(([expr, params, result]) => {
      it(`${expr}`, () => {
        assertReult(expr, params, result)
      })
    })
  })
})
