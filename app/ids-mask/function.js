import IdsInput from '../../src/ids-input/ids-input';

// Custom Input - you can only repeat "Ed" sequentially (EdEdEd)
document.addEventListener('DOMContentLoaded', () => {
  const customInput = document.querySelector('#mask-custom');
  customInput.maskOptions = {
    limit: 100
  };
  customInput.mask = (val, opts) => {
    const valid = [/[Ee]/, /[Dd]/];
    const isEven = (n) => n % 2 === 0;
    let count = opts.limit;
    const mask = [];

    let prevChar = '';
    val.split('').forEach((char) => {
      if (count < 1) {
        return;
      }

      let pushed;
      if (count === opts.limit || (isEven(count) && prevChar.match(valid[1]))) {
        // Can be "E"
        pushed = valid[0];
      } else if (!isEven(count) && prevChar.match(valid[0])) {
        // Can be "d"
        pushed = valid[1];
      } else {
        count = 0;
      }

      prevChar = char;
      count -= 1;
      mask.push(pushed);
    });

    return { mask };
  };
});
