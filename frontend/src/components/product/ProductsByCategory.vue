<template>
    <div class="products-by-category">
        <PageTitle icon="fa fa-folder-o"
            :main="category.name" sub="Categoria" />
        <ul>
            <li v-for="product in products" :key="product.id">
                <ProductItem :product="product" />
            </li>
        </ul>
        <div class="load-more">
            <button v-if="loadMore"
                class="btn btn-lg btn-outline-primary"
                @click="getProducts">Carregar Mais Produtos</button>
        </div>
    </div>    
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle'
import ProductItem from './ProductItem'

export default {
    name: 'ProductsByCategory',
    components: { PageTitle, ProductItem },
    data: function() {
        return {
            category: {},
            products: [],
            page: 1,
            loadMore: true
        }
    },
    methods: {
        getCategory() {
            const url = `${baseApiUrl}/categories/${this.category.id}`
            axios(url).then(res => this.category = res.data)
        },
        getProducts() {
            const url = `${baseApiUrl}/categories/${this.category.id}/products?page=${this.page}`
            axios(url).then(res => {
                this.products = this.products.concat(res.data)
                this.page++

                if(res.data.length === 0) this.loadMore = false
            })
        }
    },
    watch: {
        $route(to) {
            this.category.id = to.params.id
            this.products = []
            this.page = 1
            this.loadMore = true

            this.getCategory()
            this.getProducts()
        }
    },
    mounted() {
        this.category.id = this.$route.params.id
        this.getCategory()
        this.getProducts()
    }
}
</script>

<style>
    .products-by-category ul {
        list-style-type: none;
        padding: 0px;
    }

    .products-by-category .load-more {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
    }
</style>