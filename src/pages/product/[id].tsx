import { useRouter } from 'next/router'

const Product = () => {
	const router = useRouter()
	const { id } = router.query

	return <div>Product ID: {id}</div>
}

export default Product
