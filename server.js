const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

/**'resave'는 false를 권장 */
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

let user = {
    user_id: "kim",
    user_pwd: "1111"
};

app.get('/', (req, res) => {
    if(req.session.logined) {
        res.render('logout', { id: req.session.user_id });
    } else {
        res.render('login');
    }
});

app.post('/', (req, res) => {
    if(req.body.id === user.user_id && req.body.pwd === user.user_pwd) {
        req.session.logined = true;
        req.session.user_id = req.body.id;
        res.render('logout', { id: req.session.user_id });
    } else {
        res.send(`
            <h1>Who Are You?</h1>
            <a href="/">Back</a>
        `)
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

app.get('/', (req, res, next) => {
    console.log(req.session);
    if(!req.session.num) {
        req.session.num = 1;
    } else {
        req.session.num = req.session.num + 1;
    }
    res.json(`Number: ${req.session.num}`);
});

app.listen(3000, () => {
    console.log(`Listening Port 3000`)
})