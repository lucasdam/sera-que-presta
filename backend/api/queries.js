module.exports = {
    // Consulta dentro da querie
    //Pegando o Id da propria categoria que eu passei
    
    categoryWithChildren: `
        WITH RECURSIVE subcategories (id) AS (
            SELECT id FROM categories WHERE id = ?
            UNION ALL
            SELECT c.id FROM subcategories, categories c 
                WHERE "parentId" = subcategories.id
        )
        SELECT id FROM subcategories
    `
}