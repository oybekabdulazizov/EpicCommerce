const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['wks81nfn2883bawl2k21tn3']
}));
app.use(authRouter);
app.use(productsRouter);

app.listen(3001, () => {
    console.log("Listening...");
});