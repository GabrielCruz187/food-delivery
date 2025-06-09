import Image from "next/image"
import { Users, Award, Clock, Heart } from "lucide-react"
import "../../styles/about.css"

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1>Sobre Nós</h1>
            <p>
              Somos apaixonados por conectar você aos melhores sabores da cidade. Nossa missão é entregar não apenas
              comida, mas experiências gastronômicas inesquecíveis diretamente na sua porta.
            </p>
          </div>
          <div className="hero-image">
            <Image
              src="/placeholder.svg?height=400&width=600&text=Nossa+História"
              alt="Nossa história"
              width={600}
              height={400}
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <Users size={32} />
              </div>
              <div className="stat-content">
                <h3>10,000+</h3>
                <p>Clientes Satisfeitos</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Award size={32} />
              </div>
              <div className="stat-content">
                <h3>500+</h3>
                <p>Restaurantes Parceiros</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Clock size={32} />
              </div>
              <div className="stat-content">
                <h3>30 min</h3>
                <p>Tempo Médio de Entrega</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Heart size={32} />
              </div>
              <div className="stat-content">
                <h3>5 anos</h3>
                <p>Servindo a Comunidade</p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="story-content">
            <h2>Nossa História</h2>
            <p>
              Fundado em 2019, o DeliveryFood nasceu da paixão por conectar pessoas à boa comida. Começamos como uma
              pequena startup com o sonho de revolucionar a forma como as pessoas experimentam a gastronomia local.
            </p>
            <p>
              Hoje, somos uma plataforma que conecta milhares de clientes aos melhores restaurantes da cidade,
              garantindo que cada refeição seja uma experiência especial. Nossa equipe trabalha incansavelmente para
              manter os mais altos padrões de qualidade e rapidez na entrega.
            </p>
            <p>
              Acreditamos que a boa comida tem o poder de unir pessoas, criar memórias e tornar cada dia um pouco
              melhor. É por isso que nos dedicamos a oferecer não apenas um serviço de entrega, mas uma ponte entre você
              e os sabores que ama.
            </p>
          </div>
          <div className="story-image">
            <Image
              src="/placeholder.svg?height=400&width=500&text=Nossa+Equipe"
              alt="Nossa equipe"
              width={500}
              height={400}
            />
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>Nossos Valores</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Heart size={24} />
              </div>
              <h3>Paixão pela Qualidade</h3>
              <p>
                Trabalhamos apenas com restaurantes que compartilham nossa paixão pela excelência culinária e
                ingredientes frescos.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Clock size={24} />
              </div>
              <h3>Rapidez e Eficiência</h3>
              <p>
                Entendemos que seu tempo é valioso. Por isso, garantimos entregas rápidas sem comprometer a qualidade.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Users size={24} />
              </div>
              <h3>Foco no Cliente</h3>
              <p>Cada decisão que tomamos tem o cliente em mente. Sua satisfação é nossa maior recompensa.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Award size={24} />
              </div>
              <h3>Inovação Constante</h3>
              <p>
                Estamos sempre buscando novas formas de melhorar sua experiência gastronômica através da tecnologia.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Nossa Equipe</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <Image
                  src="/placeholder.svg?height=200&width=200&text=CEO"
                  alt="João Silva - CEO"
                  width={200}
                  height={200}
                />
              </div>
              <h3>João Silva</h3>
              <p className="member-role">CEO & Fundador</p>
              <p className="member-bio">
                Visionário apaixonado por tecnologia e gastronomia, João fundou a empresa com o objetivo de revolucionar
                o delivery de comida.
              </p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <Image
                  src="/placeholder.svg?height=200&width=200&text=CTO"
                  alt="Maria Santos - CTO"
                  width={200}
                  height={200}
                />
              </div>
              <h3>Maria Santos</h3>
              <p className="member-role">CTO</p>
              <p className="member-bio">
                Especialista em tecnologia com mais de 10 anos de experiência, Maria lidera nossa equipe de
                desenvolvimento.
              </p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <Image
                  src="/placeholder.svg?height=200&width=200&text=Chef"
                  alt="Carlos Oliveira - Chef Consultor"
                  width={200}
                  height={200}
                />
              </div>
              <h3>Carlos Oliveira</h3>
              <p className="member-role">Chef Consultor</p>
              <p className="member-bio">
                Chef renomado que nos ajuda a manter os mais altos padrões de qualidade em nossa seleção de
                restaurantes.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-content">
            <h2>Nossa Missão</h2>
            <p>
              Conectar pessoas aos melhores sabores da cidade, proporcionando experiências gastronômicas excepcionais
              através de um serviço de entrega rápido, confiável e inovador.
            </p>
          </div>
          <div className="vision-content">
            <h2>Nossa Visão</h2>
            <p>
              Ser a plataforma de delivery preferida, reconhecida pela excelência no atendimento, variedade de opções e
              compromisso com a satisfação do cliente.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
