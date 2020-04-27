//Filtrando requisições que não venham com o token válidos
const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
      //Paramentros especifico para extrategia
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false))
            .catch(err => done(err, false))
    })

    passport.use(strategy)
    //Esse metodo vai ser usado nas rotas para filtrar as requisições
    //e não permitir que as requisições sejam feitas em cima dos web Serveces
    //que precisam passar pelos passaportes e precisamm ter um usuario logado
    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}

