import {ENV} from '../constants/APIs';

export function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isFloat(n) {
  return n === +n && n !== (n | 0);
}

export function toFixedTruncate(num) {
  num = num.toString(); //If it's not already a String
  num = num.slice(0, num.indexOf('.') + 2); //With 3 exposing the hundredths place
  return num;
}

export function Capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function handleErrors(response) {
  if (response.ok) {
    return response;
  } else if (response.status === 422) {
    return response;
  } else {
    throw Error(response.statusText);
  }
}

export function GET(url, token) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      appId: ENV.appId,
      appKey: ENV.appKey,
      token: !!token ? token : '',
    },
  })
    .then(handleErrors)
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
}

export function POST(url, body, token = '') {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      appId: ENV.appId,
      appKey: ENV.appKey,
      token: token,
    },
    body: JSON.stringify(body),
  })
    .then(handleErrors)
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
}
