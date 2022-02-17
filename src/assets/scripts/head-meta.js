const metaTags = `
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="width=device-width, initial-scale=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="
    script-src 'self';
    style-src 'self' https://fonts.googleapis.com 'nonce-0a59a005';
    font-src 'self' data: https://fonts.gstatic.com;
  ">
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600&amp;amp;display=swap" rel="stylesheet">
`;

document.querySelector('head').insertAdjacentHTML('afterbegin', metaTags);
