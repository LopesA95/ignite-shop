import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from "keen-slider/react"
import { GetServerSideProps } from "next"
import Image from "next/image"
import { stripe } from "../lib/stripe"
import { HomeContainer, Product } from "../styles/pages/home"
import Stripe from 'stripe'

interface HomeProps {
  products: {
    name: string
    price: string
    imageUrl: string
    id: string
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    }
  })

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {Array.isArray(products) && products.length > 0 ? (
        products.map(product => (
          <Product key={product.id} className="keen-slider__slide">
            <Image src={product.imageUrl} width={520} height={480} alt={product.name} />

            <footer>
              <strong>{product.name}</strong>
              <span>{product.price}</span>
            </footer>
          </Product>
        ))
      ) : (
        <p>No products available</p>
      )}
    </HomeContainer>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await stripe.products.list({
      expand: ['data.default_price']
    })

    const products = response.data.map(product => {
      const price = product.default_price as Stripe.Price
      return {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: (price.unit_amount ? price.unit_amount / 100 : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      }
    })

    return {
      props: {
        products,
      },
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      props: {
        products: [],
      },
    }
  }
}
