import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './assets/css/style.css';

import Login from './modules/login';
import Contato from './modules/contato';

const login = new Login('.form-login');
const cadastro = new Login('.form-cadastro');

const contato = new Contato();

login.init();
cadastro.init();
contato.init();

document.addEventListener('mousemove', e => {
    const el = e.target;

    if(el.classList.contains('alert-success') || el.classList.contains('alert-danger')) {
        setTimeout(() => {
            el.remove();
        }, 3000)};
});