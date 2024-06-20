import axios from 'axios'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Stripe from 'stripe'
import { stripe } from '../../lib/stripe'
import { ImageContainer, ProductContainer, ProductDetails } from '../../styles/pages/product'
import Head from 'next/head'

interface ProductProps {
	product: {
		id: string,
		name: string,
		imageUrl: string,
		price: string,
		description: string,
		defaultPriceId: string,
	}
}

export default function Product({ product }: ProductProps) {
	const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

	async function handleBuyProduct() {
		try {
			setIsCreatingCheckoutSession(true)

			const response = await axios.post('/api/checkout', {
				priceId: product.defaultPriceId,
			})
			const { checkoutUrl } = response.data

			window.location.href = checkoutUrl
		} catch (err) {
			setIsCreatingCheckoutSession(false)
			alert('Erro ao comprar o produto. Por favor, tente novamente.')
		}
	}

	const { isFallback } = useRouter()
	if (isFallback) {
		return <div>Carregando...</div>
	}


	if (!product) {
		return <div>Produto não encontrado.</div>
	}

	return (

		<>
			<Head>
				<title>{product.name} | Ignite Shop</title>
			</Head>
			<ProductContainer>
				<ImageContainer>
					<Image src={product.imageUrl} width={520} height={480} alt={product.name} />
				</ImageContainer>

				<ProductDetails>
					<h1>{product.name}</h1>
					<span>{product.price}</span>

					<p>{product.description}</p>

					<button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>Comprar agora</button>
				</ProductDetails>
			</ProductContainer>

		</>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	// Aqui você deve buscar os IDs dos produtos disponíveis
	// e retornar os caminhos para os quais deseja gerar páginas estáticas


	return {
		paths: [],
		fallback: true,
	}
}


export const getStaticProps: GetStaticProps<ProductProps, { id: string }> = async ({ params }) => {
	if (!params || !params.id) {
		return {
			notFound: true,
		}
	}

	try {
		const productId = params.id

		const product = await stripe.products.retrieve(productId, {
			expand: ['default_price']
		})

		const price = product.default_price as Stripe.Price

		const formattedProduct = {
			id: product.id,
			name: product.name,
			imageUrl: product.images[0],
			price: (price.unit_amount ? price.unit_amount / 100 : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
			description: product.description || '',
			defaultPriceId: price.id,
		}

		return {
			props: {
				product: formattedProduct,
			},
			revalidate: 60 * 60 * 1, // 1 hora
		}
	} catch (error) {
		console.error('Erro ao buscar dados do produto:', error)
		return {
			notFound: true,
		}
	}
}
