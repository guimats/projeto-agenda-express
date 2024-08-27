const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

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

    async login() {
        this.valida();
        if (this.errors.length > 0) return;

        this.user = await LoginModel.findOne({ email: this.body.email });
        if (!this.user) {
            this.errors.push('Usuário não existe');
            return;
        }

        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida');
            this.user = null;
            return;
        }
        return;
    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        // codificando a senha do usuário (realizando hash)
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        // registrando o usuário no banco de dados
        this.user = await LoginModel.create(this.body); // só mandamos o this.body porque já limpamos ele em valida
    }

    async userExists() {
        // verificiando se o email do usuário já existe no banco de dados
        const user = await LoginModel.findOne({ email: this.body.email });
        if (user) this.errors.push('Usuário já existe');
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