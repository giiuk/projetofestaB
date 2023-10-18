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

//testando todos os campos
    if (name==null || email ==null || password == null || confirmpassword == null){
    return res.status(400).json({error : "Por favor, preencha todos os campos"});
    }

//testando senha
if(password != confirmpassword){
    return res.status(400).json({error : "As senhas não conferem!!!"})
    }

    //conferindo se o usuário já existe
    const emailExists = await User.findOne({email : email});
    if(emailExists){
    return res.status(400).json({error : "O e-mail informado já existe."})
    }

    //criando a senha com bcrypt
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //criando o usuário após as validações no sistema
    const user = new User({
    name : name,
    email : email,
    password: passwordHash
    });

    //montando um try catch para pega outros erros e afins
    try {
    const newUser = await user.save();

    //criando o token do usuario

    const token = jwt.sign({
    name : newUser.name,
    id : newUser._id
    },
    "segredo" //isso tonar o nosso token único
    );

    //retornar o token para o projeto e manda mensagem
    res.json({error: null, msg: "Você fez o cadastro com sucesso!!!", token: token, userId:
    newUser._id});
    }
     catch(error){
    res.status(400).json({error});
    }
});


router.post("/login", async(req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    //e se usuário ja existe?
    const user = await User.findOne({email : email});
    if(!user){
    return res.status(400).json({error : "E-mail não cadastrado, usuário não existe!!!"})
    }
    //testando se a senha informada foi correta
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword){
    return res.status(400).json({error: 'Senha inválida'});
    }
    //usuário ok vamos criar o token
    const token = jwt.sign({
    name : user.name,
    id : user._id
    },
    "segredo"
    );
    //retornando o token e mensagem de autorização
    res.json({error : null, msg : "Você esta logado!!!", token: token, userId: user._id})
    });
    

module.exports = router;