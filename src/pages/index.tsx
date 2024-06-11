import { styled } from '../styles'

const Button = styled('button', {
  color: 'white',
  background: '$green300',
  borderRadius: 4,
  padding: '10px',
  margin: '10px',
  border: 'none',
  cursor: 'pointer',

  span: {
    fontWeight: 'bold',
  },

  '&:hover': {
    filter: 'brightness(0.9)',
  }
})

export default function Home() {
  return (
    <>
      <h1>Hello World</h1>
      <Button>
        <span>teste</span>
        Clique aqui
      </Button>
    </>
  )
}
