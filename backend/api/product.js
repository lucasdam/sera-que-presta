const queries = require('./queries')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const product = { ...req.body }
        if(req.params.id) product.id = req.params.id
        //Validações
        try {
            existsOrError(product.name, 'Nome não informado')
            existsOrError(product.description, 'Descrição não informada')
            existsOrError(product.categoryId, 'Categoria não informada')
            existsOrError(product.userId, 'Autor não informado')
            existsOrError(product.content, 'Conteúdo não informado')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(product.id) {
            app.db('products')
                .update(product)
                .where({ id: product.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('products')
                .insert(product)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('products')
                .where({ id: req.params.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'Artigo não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const limit = 10 //Função que cria a paginação e limite de produtos por pagina
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('products').count('id').first()
        const count = parseInt(result.count)

        app.db('products')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)//O offset será um cálculo em cima do page e do limit
            .then(products => res.json({ data: products, count, limit }))//O count e o limit vão ser importantes para montar o paginador no front, fazendo assim uma unica requisição ou chamada
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('products')
            .where({ id: req.params.id })
            .first()//toda consulta ele retorna um array com o primeiro elemento do array e usa como resultado
            .then(product => {
                product.content = product.content.toString()//O produto ele vem no formato binario e vai ser convertido para string antes de retornar para o usuario 
                return res.json(product)
            })
            .catch(err => res.status(500).send(err))
    }
    //Consulta paginada
    //Atraves do page vou poder saber em que pag vou obter a consulta paginada
    //Obtendo resultado a partir do knex  na categories
    //No final vou ter um array de ids, sendo o proprio id da categoria pai 'categoryId mais os ids das categorias filha
    const getByCategory = async (req, res) => {
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        const ids = categories.rows.map(c => c.id)
    
        //consultas que vai obter os ids e vai interagir com duas tabelas diferentes
        app.db({p: 'products', u: 'users'})
            .select('p.id', 'p.name', 'p.description', 'p.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'p.userId'])
            .whereIn('categoryId', ids)
            .orderBy('p.id', 'desc')
            .then(products => res.json(products))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
       
}