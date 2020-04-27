const bcrypt = require('bcrypt-nodejs')

module.exports = app => { 
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
    
    //Função que ira criptografar a senha, ela recebe a senha e retorna o hash
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
    //Esse metodo vai servir para inserir e alterar um usuário já existente
    const save = async (req, res) => {
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword,
                'Senhas não conferem')
            
            //Confirmação se o usuario não já está cadastrado no banco
            const userFromDB = await app.db('users')
                .where({ email: user.email}).first()
            if(!user.id){
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
            
        } catch(msg){
            return res.status(400).send(msg)
        }
        //Criptografando a senha do usuário
        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id})
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))

        }

    }
    //Esse metodo get pega uma lista de todos os usuários do sistema
    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id})
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }
    //Delete de forma virtual
    const remove = async (req, res) => {
        try{
            const products = await app.db('products')
                .where({ userId: req.params.id })
            notExistsOrError(products, 'Usuário possui produtos.')

            const rowsUpdated = await app.db('users')
                .update({deletedAt: new Date()})
                .where({ id: req.params.id})
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            //Se ele passar vai gerar um status 204
            res.status(204).send()
        }catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}