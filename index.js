const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/authentication');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['wks81nfn2883bawl2k21tn3']
}));
app.use(authRouter);

app.listen(3001, () => {
    console.log("Listening...");
});