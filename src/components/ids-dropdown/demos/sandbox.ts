import '../ids-dropdown';

const dropdownXssTest: any = document.querySelector('#e2e-dropdown-xss-ajax');

if (dropdownXssTest) {
  dropdownXssTest.beforeShow = async function beforeShow() {
    return [{
      value: 'quote',
      label: '"quote"'
    }, {
      value: 'special character',
      label: '& special character'
    }, {
      value: 'angle1',
      label: '&lt; angle bracket'
    }, {
      value: 'angle2',
      label: '&gt; angle bracket'
    }, {
      value: 'brackets',
      label: '&lt;brackets&gt;'
    }, {
      value: '<script no-nonce>window.alert("dropdown xss")</script>XSS"',
      label: '<script no-nonce>window.alert("dropdown xss")</script>XSS"'
    }];
  };
}
