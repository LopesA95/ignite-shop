import Image from 'next/image'
import { useRouter } from 'next/router'
import { ImageContainer, ProductContainer, ProductDetails } from '../../styles/pages/product'

const Product = () => {
	const { query } = useRouter()

	return (
		<ProductContainer>
			<ImageContainer>
				
			</ImageContainer>

			<ProductDetails>
				<h1>Camiseta x</h1>
				<span>R$ 79,90</span>

				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus distinctio quisquam quis vel sed odit minima animi dicta quia id, ea inventore. Illum at cupiditate expedita, accusamus ut laborum voluptate!</p>

				<button>Comprar agora</button>
			</ProductDetails>
		</ProductContainer>
	)
}

export default Product
