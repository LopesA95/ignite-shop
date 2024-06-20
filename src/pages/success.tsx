import { GetServerSideProps } from "next"
import Image from "next/image"
import Link from "next/link"
import Stripe from "stripe"
import { stripe } from "../lib/stripe"
import { ImageContainer, SucessContainer } from "../styles/pages/sucess"

interface SucessProps {
	customerName: string
	product: {
		name: string
		imageUrl: string
	}
}

export default function Success({ customerName, product }: SucessProps) {
	return (
		<SucessContainer>
			<h1>Compra efetuada!</h1>

			<ImageContainer>

				<Image src={product.imageUrl} width={120} height={110} alt='' />

			</ImageContainer>

			<p>
				Uhuul <strong>{customerName}</strong>, sua Camiseta <strong>{product.name}</strong> ja está a caminho de sua casa.
			</p>

			<Link href='/'>
				Voltar ao catalogo
			</Link>
		</SucessContainer>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const session_id = String(query.session_id)

	const session = await stripe.checkout.sessions.retrieve(session_id, {
		expand: ['line_items', 'line_items.data.price.product']
	})

	const customerName = session.customer_details.name
	const product = session.line_items.data[0].price.product as Stripe.Product

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
