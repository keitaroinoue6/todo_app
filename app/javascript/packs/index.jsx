import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom';
//BrowserRouterというのをreact-router-domというところからインポートしている
import App from '../components/App'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter> 
      <App/>
    </BrowserRouter>,
    document.querySelector('#root'),//idがrootという要素を取得してきて、Appコンポーネントを描画している
  );
});

//BrowserRouterでAppを囲っておるのでAppコンポーネントではreact-router-domのスイッチやリンクが使える
//さらにAppの子要素のコンポーネントに対してもリンクとかが使える
