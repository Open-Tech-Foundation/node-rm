import { style } from '@open-tech-world/es-cli-styles';
import IOptions from './IOptions';

function printResult(result: string[], options: IOptions): void {
  result.forEach((item) => {
    if (options.colors) {
      console.log(style('~red{' + item + '}'));
      return;
    }
    console.log(item);
  });
}

export default printResult;
