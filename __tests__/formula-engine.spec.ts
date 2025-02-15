import { FormulaEngine } from '../src'

const engine = new FormulaEngine()

function assertEqual(formula: string, result: any, variables?: Record<string, any>) {
  expect(engine.exec(formula, variables)).toEqual(result)
}

describe('加减乘除', () => {
  const items: any[] = [
    ['++1', 2],
    ['--1', 0],
    ['1++', 1],
    ['1--', 1],
    ['++1 + ++1', 4],
    ['1 + !2 * 3 / 4 & 5 !== 6 && 1 * 2 + 3', 5],
    ['(1 + !2 * 3 / 4 & 5) !== (6 && 1 * 2 + 3)', true],
    ['10 + 20', 30],
    ['20 - 10', 10],
    ['10 * 20', 200],
    ['20 / 10', 2],
    ['20 + 10 * 2 / 2 - 10', 20],
    ['( 20 + 10 ) * 2 / 2 - 10', 20],
    ['{a} + {b} * {c} - {d} / {e}', 6.2, { a: 1, b: 2, c: 3, d: 4, e: 5 }]
  ]

  items.forEach(([expr, result, variables]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result, variables)
    })
  })
})

describe('UPPER-将一个文本字符串中的所有小写字母转换为大写字母', () => {
  const items: [string, any][] = [
    ['UPPER()', ''],
    ['UPPER("张三")', '张三'],
    ['UPPER("张三abc")', '张三ABC'],
    ['UPPER("abc张三")', 'ABC张三'],
    ['UPPER("abc张三abc")', 'ABC张三ABC']
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('UNION-剔除重复数据', () => {
  const items: [string, any][] = [
    ['UNION()', []],
    ['UNION([])', []],

    ['UNION([1])', [1]],
    ['UNION(["1"])', ['1']],

    ['UNION(2,3,4,3)', [2, 3, 4]],
    ['UNION(2,3,4)', [2, 3, 4]],
    ['UNION(2,2,2)', [2]],

    ['UNION([2,3,4,3])', [2, 3, 4]],
    ['UNION([2,3,4])', [2, 3, 4]],
    ['UNION([2,2,2])', [2]],

    ['UNION("a","3","4","3")', ['a', '3', '4']],
    ['UNION("a","3","4")', ['a', '3', '4']],
    ['UNION("a","a","a")', ['a']],

    ['UNION(["a","3","4","3"])', ['a', '3', '4']],
    ['UNION(["a","3","4"])', ['a', '3', '4']],
    ['UNION(["a","a","a"])', ['a']],
    ['UNION(["a","a","a"])', ['a']],
    ['UNION("a","b","c")', ['a', 'b', 'c']]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('VALUE-将内容为数字的文本转化为数字格式', () => {
  const items: [string, any][] = [
    ['VALUE(3)', 3],
    ['VALUE(3.123456789)', 3.123456789],
    ['VALUE(1e5)', 100000]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('JOIN-连接数组元素', () => {
  const items: [string, any][] = [
    ['JOIN([], ",")', ''],
    ['JOIN(["张三","李四","王五"], ",")', '张三,李四,王五'],
    ['JOIN(["张三","李四","王五"], "的")', '张三的李四的王五'],
    ['JOIN(["张三","李四","王五"], 1)', ''],
    ['JOIN([1,2,3], "的")', '1的2的3']
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('ABS-绝对值', () => {
  const items: [string, any][] = [
    ['ABS()', 0],
    ['ABS(1)', 1],
    ['ABS(1.123456)', 1.123456],
    ['ABS(-1.123456)', 1.123456],
    ['ABS("1e")', 0]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('AVERAGE', () => {
  const items: [string, any][] = [
    ['AVERAGE([])', 0],
    ['AVERAGE([1,2,3,4,5,6])', 3.5],
    ['AVERAGE([1,2,3,4,5,6,"dd"])', 3.5],
    ['AVERAGE(["dd"])', 0]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('COUNT-计数', () => {
  const items: [string, any][] = [
    ['COUNT()', 0],
    ['COUNT(1,2,3,4,5,6)', 6],
    ['COUNT(1,2,3,4,5,6,"dd")', 7],
    ['COUNT("dd")', 1]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('COUNTIF-条件计数', () => {
  const items: [string, any][] = [
    ['COUNTIF([1,2,3,4,5,6],">=2")', 5],
    ['COUNTIF([1,2,3,4,5,6],"!=2")', 5],
    ['COUNTIF([1,2,3,4,5,6,"dd"],"dd")', 1]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('CEILING-向上舍入为最接近的指定基数的倍数', () => {
  const items: [string, any][] = [
    ['CEILING(10,3)', 12],
    ['CEILING(10,-3)', 12],
    ['CEILING(-10,3)', -9],
    ['CEILING(-10,-3)', -12]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('FLOOR-向下取整', () => {
  const items: [string, any][] = [
    ['FLOOR(10,3)', 9],
    ['FLOOR(10,-3)', 9],
    ['FLOOR(-10,3)', -12],
    ['FLOOR(-10,-3)', -9]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('FIXED-舍入到指定的小数位数', () => {
  const items: [string, any][] = [
    ['FIXED("ggg")', NaN],
    ['FIXED("10",1)', '10.0'],
    ['FIXED(10,1)', '10.0'],
    ['FIXED(10.3333333,1)', '10.3'],
    ['FIXED(10.6666666,1)', '10.7'],
    ['FIXED(10.6,10)', '10.6000000000']
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('INT-向下取整', () => {
  const items: [string, any][] = [
    ['INT(2.2)', 2],
    ['INT(-2.1)', -3]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('LARGE-第n个最大数', () => {
  const items: [string, any][] = [
    ['LARGE([89,98,76],1)', 98],
    ['LARGE([89,98,76],3)', 76],
    ['LARGE([89,98,76],4)', 98],
    ['LARGE([98,98,98],1)', 98],
    ['LARGE([98,98,98],6)', 98]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('SMALL-第n个最小数', () => {
  const items: [string, any][] = [
    ['SMALL([89,98,76],1)', 76],
    ['SMALL([89,98,76],3)', 98],
    ['SMALL([89,98,76],4)', 76],
    ['SMALL([98,98,98],1)', 98],
    ['SMALL([98,98,98],6)', 98]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('LOG', () => {
  const items: [string, any][] = [
    ['LOG(10)', 1],
    ['LOG(10,10)', 1],
    ['LOG(4,2)', 2]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('MOD-求余', () => {
  const items: [string, any][] = [
    ['MOD(3,2)', 1],
    ['MOD(-3,2)', 1],
    ['MOD(3,-2)', -1],
    ['MOD(3,-4)', -3],
    ['MOD(3,0)', NaN]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('MAX-最大值', () => {
  const items: [string, any][] = [
    ['MAX(3,2,1)', 3],
    ['MAX(-3,2)', 2],
    ['MAX(3,3)', 3],
    ['MAX("d")', 0]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('MIN-最小值', () => {
  const items: [string, any][] = [
    ['MIN(3,2,1)', 1],
    ['MIN(-3,2)', -3],
    ['MIN(3,3)', 3],
    ['MIN("d")', 0],
    ['!MIN("d")', true]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('POWER-求幂', () => {
  const items: [string, any][] = [
    ['POWER("-3",2)', 9],
    ['POWER("-3","2")', 9],
    ['POWER(-3,2)', 9],
    ['POWER(3,3)', 27]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('PRODUCT-求乘积', () => {
  const items: [string, any][] = [
    ['PRODUCT(2,6)', 12],
    ['PRODUCT(2,6,2)', 24],
    ['PRODUCT(0.5,0.8)', 0.4]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('ROUND-四舍五入到指定的位数', () => {
  const items: [string, any][] = [
    ['ROUND(0.3141592653,3)', 0.314],
    ['ROUND(0.3141592653,4)', 0.3142],
    ['ROUND(88/3,4)', 29.3333]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('SQRT-正平方根', () => {
  const items: [string, any][] = [
    ['SQRT(10)', 3.1622776601683795],
    ['SQRT(9)', 3],
    ['SQRT(-9)', 0]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('SUM-求和', () => {
  const items: [string, any, any?][] = [
    ['SUM()', 0],
    ['SUM(9)', 9],
    ['SUM(1,2,3,4,5,6)', 21],
    ['SUM({a},{b},{c},{d},{e},{f})', 21, { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }],
    ['SUM({arr})', 21, { arr: [1, 2, 3, 4, 5, 6] }]
  ]

  items.forEach(([expr, result, variables]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result, variables)
    })
  })
})

describe('SUMPRODUCT-乘积之和', () => {
  const items: [string, any][] = [
    ['SUMPRODUCT([1,2,3],[0.1,0.2,0.3])', 1.4],
    ['SUMPRODUCT([1,2,3],[0.1])', 5.1],
    ['SUMPRODUCT([1,2,3])', 6]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('SIN-正弦函数', () => {
  const items: [string, any][] = [
    ['SIN(30)', 0.5],
    ['SIN(-30)', -0.5],
    ['SIN(45)', 0.70710678]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('COS-余弦函数', () => {
  const items: [string, any][] = [
    ['COS(60)', 0.5],
    ['COS(120)', -0.5],
    ['COS(45)', 0.70710678]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('TAN-正切函数', () => {
  const items: [string, any][] = [
    ['TAN(45)', 1],
    ['TAN(60)', 1.73205081],
    ['TAN(-45)', -1]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('COT-余切函数', () => {
  const items: [string, any][] = [
    ['COT(45)', 1],
    ['COT(60)', 0.57735027],
    ['COT(-45)', -1]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('RADIANS-根据角度求弧度', () => {
  const items: [string, any][] = [
    ['RADIANS(180)', 3.14159265],
    ['RADIANS(-60)', -1.04719755]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('RMBCAP-数字转人民币大写', () => {
  const items: [string, any][] = [
    ['RMBCAP(123.456)', '壹佰贰拾叁元肆角陆分'],
    ['RMBCAP(0.456)', '零元肆角陆分'],
    ['RMBCAP(-60)', '负陆拾元整']
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('DATE', () => {
  const items: [string, any][] = [
    ['DATE(1672531200000)', 'Sun Jan 01 2023 08:00:00 GMT+0800'],
    ['DATE("2023-01-01")', 'Sun Jan 01 2023 00:00:00 GMT+0800'],
    ['DATE(2023,01,01)', 'Sun Jan 01 2023 00:00:00 GMT+0800'],
    ['DATE(2023,01,01,0,0,0)', 'Sun Jan 01 2023 00:00:00 GMT+0800']
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('YEAR', () => {
  const items: [string, any][] = [['YEAR(1672531200000)', '2023']]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('MONTH', () => {
  const items: [string, any][] = [['MONTH(1637244864000)', '11']]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('DAY', () => {
  const items: [string, any][] = [['DAY(1642471500000)', '18']]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('HOUR', () => {
  const items: [string, any][] = [['HOUR(1637244864000)', '22']]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('MINUTE', () => {
  const items: [string, any][] = [['MINUTE(1637244864000)', '14']]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('SECOND', () => {
  const items: [string, any][] = [['SECOND(1637244864000)', '24']]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('DAYS', () => {
  const items: [string, any][] = [
    ['DAYS(1637763264000, 1637244864000)', '6'],
    ['DAYS(1637763264000, 1637763264000)', '0']
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('DATEDIF', () => {
  const items: [string, any][] = [
    ['DATEDIF(1637763264000, 1637244864000)', '6'],
    ['DATEDIF(1637763264000, 1637244864000, "y")', '0'],
    ['DATEDIF(1637763264000, 1637244864000, "M")', '0'],
    ['DATEDIF(1637763264000, 1637244864000, "d")', '6'],
    ['DATEDIF(1637763264000, 1637244864000, "h")', '144'],
    ['DATEDIF(1637763264000, 1637244864000, "s")', '518400']
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('DATEDELTA', () => {
  const items: [string, any][] = [['DATEDELTA(1637244864000, 6)', 'Wed Nov 24 2021 22:14:24 GMT+0800']]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('TIMESTAMP', () => {
  const items: [string, any][] = [['TIMESTAMP("2023-05-06")', 'Sat May 06 2023 00:00:00 GMT+0800']]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

// describe('WORKDAY', () => {
//   const items: [string, any][] = [
//     ['WORKDAY(1680192000000,15)', '2023-04-23'],
//     ['WORKDAY(1680192000000,15,[1680624000000])', '2023-04-24'],
//     ['WORKDAY(1680192000000,15,[1680624000000,1680710400000])', '2023-04-25']
//   ]

//   items.forEach(([expr, result]) => {
//     it(`${expr}`, () => {
//       assertEqual(expr, result)
//     })
//   })
// })

describe('WEEKNUM', () => {
  const items: [string, any][] = [
    ['WEEKNUM(1695190635073)', 38],
    ['WEEKNUM(1695190635073, 1)', 38],
    ['WEEKNUM(1695190635073, 2)', 39]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})
describe('ISOWEEKNUM', () => {
  const items: [string, any][] = [
    ['ISOWEEKNUM("2023-01-05")', 1],
    ['ISOWEEKNUM(1672848000000)', 1]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})
describe('WEEKDAY', () => {
  const items: [string, any][] = [['WEEKDAY(1695114206578)', '2']]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('INDEX', () => {
  const items: [string, any][] = [['INDEX([1,2,3],1)', 2]]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('SUMIF', () => {
  const items: [string, any][] = [
    [`SUMIF(["水果","蔬菜","面食"],"水果",[30,25,90])`, 30],
    [`SUMIF(["水果","蔬菜","水果"],"水果",[30,25,90])`, 30 + 90] //
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('SUMIFS', () => {
  const items: [string, any][] = [
    [
      `SUMIFS([1, 2, 3, 4,5], ['苹果', '葡萄', '苹果', '香蕉','苹果'], '苹果', ['红富士', '红星', '红富士', '夏黑','红星'], '红富士')`,
      4
    ], //
    [
      `SUMIFS([1, 2, 3, 4,5], ['苹果', '葡萄', '苹果', '香蕉','苹果'], '苹果', ['红富士', '红星', '红富士', '夏黑','红富士'], '红富士')`,
      4 + 5
    ] //
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})

describe('AND', () => {
  const items: [string, any][] = [
    [`AND(true,true)`, true],
    [`AND(true,false)`, false],
    [`AND(true,1)`, true],
    [`AND(true,0)`, false],
    [`AND(true,NaN)`, false],
    [`AND(NaN,NaN)`, false],
    [`AND(null,null)`, false],
    [`AND(undefined,null)`, false],
    [`AND(undefined,NaN)`, false],
    [`AND(undefined,undefined)`, false],
    ['AND(1<5,1<6)', true],
    ['AND(1<5,1<6,1<3)', true],
    ['AND(1<5,1<6,1<3,1<2)', true],
    ['AND(1<5,7<6)', false]
  ]

  items.forEach(([expr, result]) => {
    it(`${expr}`, () => {
      assertEqual(expr, result)
    })
  })
})
describe('OR', () => {
  const items: [string, any][] = [
    [`OR(true,true)`, true],
    [`OR(true,false)`, true],
    [`OR(true,1)`, true],
    [`OR(true,0)`, true],
    [`OR(true,NaN)`, true],
    [`OR(NaN,NaN)`, false],
    [`OR(null,null)`, false],
    [`OR(undefined,null)`, false],
    [`OR(undefined,NaN)`, false],
    [`OR(undefined,undefined)`, false],
    [`OR(undefined,undefined,true)`, true],
    ['OR(1<5,1<6)', true],
    ['OR(1<5,1<6,1<3)', true],
    ['OR(1<5,1<6,1<3,1<2)', true],
    ['OR(1<5,7<6)', true],
    ['OR(7<5,7<6)', false]
  ]

  items.forEach(([expr, result]) => it(`${expr}`, () => assertEqual(expr, result)))
})

describe('IFS', () => {
  const items: [string, any, any?][] = [
    [`IFS(true,1,true,2,true,3)`, 1],
    [`IFS(false,1,true,2,true,3)`, 2],
    [`IFS(false,1,false,2,true,3)`, 3],
    [`IFS(false,1,false,2,false,3)`, undefined],
    [`IFS({n}<60,"不及格",{n}<=79,"及格",{n}<=89,"良好",{n}>=90,"优秀")`, '不及格', { n: 59 }],
    [`IFS({n}<60,"不及格",{n}<=79,"及格",{n}<=89,"良好",{n}>=90,"优秀")`, '优秀', { n: 100 }]
  ]

  items.forEach(([expr, result, vars]) => it(`${expr}`, () => assertEqual(expr, result, vars)))
})

describe('NOT', () => {
  const items: [string, any, any?][] = [
    [`NOT(true)`, false],
    [`NOT(1>2)`, true],
    [`NOT(1<2)`, false],
    [`NOT({n}<2)`, true, { n: 10 }]
  ]

  items.forEach(([expr, result, vars]) => it(`${expr}`, () => assertEqual(expr, result, vars)))
})

describe('XOR', () => {
  const items: [string, any, any?][] = [
    [`XOR(true)`, true],
    [`XOR(false)`, true],
    [`XOR(true,true)`, false],
    [`XOR(false,false)`, false],
    [`XOR(true,false)`, true],

    [`XOR(true,true,true)`, true],
    [`XOR(false,true,true)`, false],
    [`XOR(true,false,true)`, false],
    [`XOR(true,true,false)`, false],

    [`XOR(false,false,false)`, false],
    [`XOR(true,false,false)`, true],
    [`XOR(false,true,false)`, true],
    [`XOR(false,false,true)`, true]
  ]

  items.forEach(([expr, result, vars]) => it(`${expr}`, () => assertEqual(expr, result, vars)))
})

describe('CONCATENATE', () => {
  const items: [string, any, any?][] = [
    [`CONCATENATE('a','b','c')`, 'abc'],
    [`CONCATENATE(1,2,3)`, '123'],
    [
      `CONCATENATE("name:",{name},CHAR(10),"gender:",{gender},CHAR(10),"phone:",{phone})`,
      'name:Tom\ngender:Man\nphone:1111',
      { name: 'Tom', gender: 'Man', phone: '1111' }
    ]
  ]

  items.forEach(([expr, result, vars]) => it(`${expr}`, () => assertEqual(expr, result, vars)))
})

describe('CHAR', () => {
  const items: [string, any, any?][] = [
    [`CHAR(9)`, '\t'],
    [`CHAR(10)`, '\n'],
    [`CHAR(34)`, '"'],
    [`CHAR(39)`, "'"],
    [`CHAR(92)`, '\\']
  ]

  items.forEach(([expr, result, vars]) => it(`${expr}`, () => assertEqual(expr, result, vars)))
})
describe('EXACT', () => {
  const items: [string, any, any?][] = [
    [`EXACT("9","9")`, true],
    [`EXACT(10,10)`, true],
    [`EXACT(0,0)`, true],
    [`EXACT(true,true)`, true],
    [`EXACT(true,false)`, false],
    [`EXACT(1,true)`, false],
    [`EXACT(NaN,NaN)`, false],
    [`EXACT(null,null)`, true],
    [`EXACT(undefined,undefined)`, true],
    [`EXACT(null,undefined)`, false]
  ]

  items.forEach(([expr, result, vars]) => it(`${expr}`, () => assertEqual(expr, result, vars)))
})
