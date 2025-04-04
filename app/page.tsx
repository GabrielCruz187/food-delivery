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
            Delicious Food <span>Delivered To Your Door</span>
          </h1>
          <p>Order your favorite meals from the best restaurants in town</p>
          <Link href="/menu" className="primary-button">
            View Menu
          </Link>
        </div>
        <div className="hero-image">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Delicious food display"
            width={600}
            height={400}
            className="hero-img"
          />
        </div>
      </section>

      <section className="categories-section">
        <h2>Food Categories</h2>
        <div className="categories-grid">
          {["Pizza", "Burgers", "Sushi", "Pasta", "Desserts", "Drinks"].map((category) => (
            <Link href={`/menu?category=${category.toLowerCase()}`} key={category} className="category-card">
              <div className="category-image">
                <Image
                  src={`/placeholder.svg?height=120&width=120&text=${category}`}
                  alt={category}
                  width={120}
                  height={120}
                />
              </div>
              <h3>{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Items</h2>
        <div className="featured-grid">
          {[
            {
              id: 1,
              name: "Margherita Pizza",
              price: 12.99,
              image: "/placeholder.svg?height=200&width=200&text=Pizza",
            },
            { id: 2, name: "Classic Burger", price: 9.99, image: "/placeholder.svg?height=200&width=200&text=Burger" },
            { id: 3, name: "Pasta Carbonara", price: 14.99, image: "/placeholder.svg?height=200&width=200&text=Pasta" },
            { id: 4, name: "California Roll", price: 16.99, image: "/placeholder.svg?height=200&width=200&text=Sushi" },
          ].map((item) => (
            <div className="menu-item" key={item.id}>
              <div className="item-image">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} width={200} height={200} />
              </div>
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price}</p>
                <AddToCartButton item={item} />
              </div>
            </div>
          ))}
        </div>
        <div className="view-all">
          <Link href="/menu" className="secondary-button">
            View All Menu Items
          </Link>
        </div>
      </section>
    </main>
  )
}


