const authRouter = require("./routes/authRoutes");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// registrando um usuário
router.post("/register", async(req, res)=>{
const name = req.body.name;
const email = req.body.email;
const password = req.body.password;
const confirmpassword = req.body.confirmpassword;

//checando se todos os dados foram enviados
if (name==null || email ==null || password == null || confirmpassword == null){
return res.status(400).json({error : "Por favor, preencha todos os campos"});
}
});
module.exports = router;