const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    res.render('login');
};

exports.register = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.register();
        if (login.errors.length > 0) {
            // criando uma flash message (mensagem que só são exibidas uma vez)
            req.flash('errors', login.errors);
            // salvando a sessão com o flash e redirecionando de volta para a página do forms
            req.session.save(() => {
                return res.redirect('index');
            });
            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso');
        req.session.save(() => {
            return res.redirect('index');
        });

    } catch (e) {
        console.log(e);
        return res.render('404');
    }

};