import validator from "validator";

export default class Contato {
    constructor() {
        this.form = document.querySelector('.contato');
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
        const nomeInput = el.querySelector('input[name="nome"]');
        const emailInput = el.querySelector('input[name="email"]');
        const telefoneInput = el.querySelector('input[name="telefone"]');
        let error = false;

        // removendo mensagens de erro
        for(let erroText of this.form.querySelectorAll('.erro-msg')) erroText.remove();
        
        if (nomeInput.value.length < 1) {
            error = this.adicionarErro(nomeInput, '*Nome precisa ser preenchido');
        }
        if (emailInput.value && !validator.isEmail(emailInput.value)) {
            error = this.adicionarErro(emailInput, '*Email inválido');
        }
        if (!emailInput.value && !telefoneInput.value) {
            error = this.adicionarErro(emailInput, '*Campo e-mail ou telefone precisa ser preenchido');
            error = this.adicionarErro(telefoneInput, '*Campo e-mail ou telefone precisa ser preenchido');
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