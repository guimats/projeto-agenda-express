import validator from "validator";

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if(!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        });
    }

    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const passwordInput = el.querySelector('input[name="password"]');
        let error = false;

        // removendo mensagens de erro
        for(let erroText of this.form.querySelectorAll('.erro-msg')) erroText.remove();
        
        if (!validator.isEmail(emailInput.value)) {
            error = this.adicionarErro(emailInput, 'Email inválido');
        }    
        if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
            error = this.adicionarErro(passwordInput, 'A senha precisa ter entre 3 e 50 caracteres');
        }

        if(!error) el.submit();
    }

    adicionarErro(input, msg) {
        // criando div com mensagem de erro
        const div = document.createElement('div');
        div.classList.add('erro-msg');
        div.classList.add('text-danger');
        div.innerHTML = msg;

        input.insertAdjacentElement('afterend', div);
        return true;
    }
}