<template>
    <div class="product-item">
        <router-link :to="{ name: 'productById', params: { id: product.id } }">
            <div class="product-item-image d-none d-sm-block">
                <img v-if="product.imageUrl"
                    :src="product.imageUrl"
                    height="150" width="150" alt="Product">
                <img v-else
                    src="@/assets/article.png"
                    height="150" width="150" alt="Product">
            </div>
            <div class="product-item-info">
                <h2>{{ product.name }}</h2>
                <p>{{ product.description }}</p>
                <span class="product-item-author">
                    <strong>Autor: </strong>{{ product.author }}
                </span>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'ProductItem',
    props: ['product']
}
</script>

<style>
    .product-item {
        border-radius: 8px;
        margin-bottom: 20px;
        background-color: #FFF;
        padding: 20px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    }

    .product-item a {
        display: flex;
        align-items: flex-start;
        text-decoration: none;
        color: #000;
    }

    .product-item-info h2 {
        font-size: 1.7rem;
    }

    .product-item-image {
        padding-right: 20px;
        margin-right: 20px;
        border-right: 1px solid #AAA;
    }

    .product-item-image img {
        border-radius: 5px;
    }

    .product-item-info {
        display: flex;
        align-self: stretch;
        flex-direction: column;
    }

    .product-item-info p {
        flex: 1;
        color: #555;
        font-size: 1.1rem;
    }
</style>