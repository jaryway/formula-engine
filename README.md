# @jaryway/formula-engine

这个是一个公式引擎库


## Development

```bash
# install dependencies
pnpm install
# build library
pnpm run build
# develop library
pnpm run dev
```

## Usage

```js
import { FormulaEngine } from '@jaryway/formula-engine'
const formula = new FormulaEngine()
formula.exec('SUM(1,2,3,4,5,6)') // return 21
formula.exec('SUM({arr})', { arr: [1, 2, 3, 4, 5, 6] }) // return 21
formula.exec('{a} + {b} * {c} - {d} / {e}', { a: 1, b: 2, c: 3, d: 4, e: 5 }) // return 21
```

## License

[MIT](LICENSE).
