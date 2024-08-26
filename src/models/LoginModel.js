const mongoose = require('mongoose');
const validator = require('validator');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        // recebendo o req.body com o post do formulário
        this.body = body;
        // array vazio que receberá os erros
        this.errors = [];
        this.user = null;
    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;
        try {
            this.user = await LoginModel.create(this.body); // só mandamos o this.body porque já limpamos ele em valida
        } catch (e) {
            console.log(e);
        }
    }

    valida() {
        this.cleanUp();
        // validação
        // email precisa ser valido
        if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido');

        // senha precisa ter entre 3 e 50
        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
        }

    }

    cleanUp() {
        // confirmando se todo campo do form enviado no body é string (caso não, atribui o valor de uma string vazia para ele)
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        // garantido que o objeto tenha somente os campos desejados
        this.body = {
            email: this.body.email,
            password: this.body.password,
        }
    }
}

module.exports = Login;