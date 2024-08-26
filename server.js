require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('BD conectado')
        app.emit('pronto');
    })
    .catch(e => console.log(e));
const session = require('express-session'); // mantém dados salvos em cookie
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); // mensagem que é exibida apenas uma vez
const routes = require('./routes'); // rotas da aplicação
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());

app.use(express.urlencoded({ extended: true })); // permite postar forms para dentro da aplicação
app.use(express.json()); // permite postar json para dentro da aplicação
app.use(express.static(path.resolve(__dirname, 'public')));


const sessionOptions = session({
    secret: 'SKDJHASDJKHASDJKsdsadas dasa dasd@@313',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    receive: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());

// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
        console.log('Servidor executando na porta 3000');
    });
});
