//Atualizando os bancos de tempos em tempos, ou seja de 1 em 1 minuto
const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function(){
        const usersCount = await app.db('users').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const productsCount = await app.db('products').count('id').first()

        const { Stat } = app.api.stat
    
        //Pegando a ultima estatistica do mongodb 
        const lastStat = await Stat.findOne( {}, {},
            { sort: { 'createdAt' : -1 } })

        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            products: productsCount.count,
            createdAt: new Date()
        })
        //comparando as duas estatísticas se ele mudaram ou não, e se mudou eu pessisto mo mongodb ou não
        //Se a ultima estatística não estiver setada ou o valor for diferente considera-se que:
        // o usuário ou  a categoria ou o produto mudaram
        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeCategories = !lastStat || stat.categories !== lastStat.categories
        const changeProducts = !lastStat || stat.products !== lastStat.products

        //Se mudou alguma das estatística mudou, já habilita para 
        //ser inserido o novo registro no mongodb
        if(changeUsers || changeCategories || changeProducts){
            stat.save().then(() => console.log('[Stats] Estatísticas atualizadas'))

        }

    })       
    
}
