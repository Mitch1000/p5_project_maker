import P5 from 'p5';
import code from './code';

const sketch = (p5) => Object.assign(p5, code(p5));

export default new P5(sketch);
