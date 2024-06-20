import { GetServerSideProps } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import Stripe from "stripe"
import { stripe } from "../lib/stripe"
import { ImageContainer, SucessContainer } from "../styles/pages/sucess"


interface SuccessProps {
	customerName: string
	product: {
		name: string
		imageUrl: string
	}
}

export default function Success({ customerName, product }: SuccessProps) {
	return (
		<>
			<Head>
				<title>Compra efetuada | Ignite Shop</title>
				<meta name='robots' content='noindex' />
			</Head>
			<SucessContainer>
				<h1>Compra efetuada!</h1>
				<ImageContainer>
					<Image src={product.imageUrl} width={120} height={110} alt={product.name} />
				</ImageContainer>
				<p>
					Uhuul <strong>{customerName}</strong>, sua Camiseta <strong>{product.name}</strong> já está a caminho de sua casa.
				</p>
				<Link href='/'>
					<a>Voltar ao catálogo</a>
				</Link>
			</SucessContainer>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	if (!query.session_id) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			}
		}
	}

	const sessionId = query.session_id as string
	const session = await stripe.checkout.sessions.retrieve(sessionId, {
		expand: ['line_items', 'line_items.data.price.product']
	})

	const customerName = session.customer_details?.name ?? 'Cliente'
	const product = session.line_items?.data[0].price?.product as Stripe.Product

	return {
		props: {
			customerName,
			product: {
				name: product.name,
				imageUrl: product.images[0],
			}
		}
	}
}
