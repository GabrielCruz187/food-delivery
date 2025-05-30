import Link from "next/link"
import Image from "next/image"
import "../styles/home.css"
import AddToCartButton from "@/components/add-to-cart-button"

export default function Home() {
  return (
    <main className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Comida Deliciosa <span>Entregue na Sua Porta</span>
          </h1>
          <p>Peça suas refeições favoritas dos melhores restaurantes da cidade</p>
          <Link href="/menu" className="primary-button">
            Ver Cardápio
          </Link>
        </div>
        <div className="hero-image">
          <Image
            src="/principal.webp"
            alt="Exibição de comida deliciosa"
            width={600}
            height={400}
            className="hero-img"
          />
        </div>
      </section>

      <section className="categories-section">
        <h2>Categorias de Comida</h2>
        <div className="categories-grid">
          {[
            { name: "Pizza", category: "pizza" },
            { name: "Hambúrgueres", category: "burgers" },
            { name: "Sushi", category: "sushi" },
            { name: "Massas", category: "pasta" },
            { name: "Sobremesas", category: "desserts" },
            { name: "Bebidas", category: "drinks" },
          ].map((item) => (
            <Link href={`/menu?category=${item.category}`} key={item.category} className="category-card">
              <div className="category-image">
                <Image
                  src={`/placeholder.svg?height=120&width=120&text=${item.name}`}
                  alt={item.name}
                  width={120}
                  height={120}
                />
              </div>
              <h3>{item.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <h2>Itens em Destaque</h2>
        <div className="featured-grid">
          {[
            {
              id: 1,
              name: "Pizza Margherita",
              price: 12.99,
              image: "/placeholder.svg?height=200&width=200&text=Pizza",
            },
            {
              id: 2,
              name: "Hambúrguer Clássico",
              price: 9.99,
              image: "/placeholder.svg?height=200&width=200&text=Hambúrguer",
            },
            {
              id: 3,
              name: "Macarrão Carbonara",
              price: 14.99,
              image: "/placeholder.svg?height=200&width=200&text=Massa",
            },
            {
              id: 4,
              name: "California Roll",
              price: 16.99,
              image: "/placeholder.svg?height=200&width=200&text=Sushi",
            },
          ].map((item) => (
            <div className="menu-item" key={item.id}>
              <div className="item-image">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} width={200} height={200} />
              </div>
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-price">R${item.price}</p>
                <AddToCartButton item={item} />
              </div>
            </div>
          ))}
        </div>
        <div className="view-all">
          <Link href="/menu" className="secondary-button">
            Ver Todos os Itens do Cardápio
          </Link>
        </div>
      </section>
    </main>
  )
}


