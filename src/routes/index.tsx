import { createFileRoute } from "@tanstack/react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { WashingMachine, QrCode, Timer, Wind, PawPrint } from "lucide-react";

import slider1 from "@/assets/slider1.png";
import slider2 from "@/assets/slider2.png";
import slider3 from "@/assets/slider3.png";
import slider4 from "@/assets/slider4.png";
import logo from "@/assets/logo.png";
import "@/styles/lavtudo.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LavTudo — Lavanderia self-service" },
      {
        name: "description",
        content:
          "LavTudo: lavanderia self-service com lavadoras, secadoras e lavadora pet. Escaneie o QR code e acompanhe sua lavagem.",
      },
      { property: "og:title", content: "LavTudo — Lavanderia self-service" },
      {
        property: "og:description",
        content:
          "Lavadoras, secadoras e lavadora pet. Escaneie o QR code e acompanhe sua lavagem em tempo real.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="main-container">
      <header className="cima">
        <div className="logo-area">
          <img src={logo} alt="Máquina LavTudo" className="logo-icon" />
          <h3>LavTudo</h3>
        </div>
        <button id="contato">Entre em Contato</button>
      </header>

      <div className="slider-container">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="mySwiper"
        >
          <SwiperSlide>
            <img src={slider1} alt="Slide 1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={slider2} alt="Slide 2" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={slider3} alt="Slide 3" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={slider4} alt="Slide 4" />
          </SwiperSlide>
        </Swiper>
      </div>

      <section className="hero"></section>

      <h2>Como Funciona</h2>

      <div className="container-cards">
        <div className="card">
          <span className="card-number">1</span>
          <div className="card-icon">
            <WashingMachine size={36} color="#7c5cbf" />
          </div>
          <h4>Inicie a máquina</h4>
          <p>Ligue sua máquina normalmente.</p>
        </div>
        <div className="card">
          <span className="card-number">2</span>
          <div className="card-icon">
            <QrCode size={36} color="#7c5cbf" />
          </div>
          <h4>Escaneie o QR code</h4>
          <p>Escaneie o QR code disponível na lavanderia.</p>
        </div>
        <div className="card">
          <span className="card-number">3</span>
          <div className="card-icon">
            <Timer size={36} color="#7c5cbf" />
          </div>
          <h4>Tempo para a lavagem</h4>
          <p>Acompanhe o tempo restante em tempo real.</p>
        </div>
      </div>

      <h3 className="fth2">Nós temos</h3>
      <div className="fth2-underline"></div>

      <div className="container-cards">
        <div className="card card-produto">
          <div className="card-icon-produto">
            <WashingMachine size={32} color="#7c5cbf" />
          </div>
          <h4>Lavadora</h4>
        </div>
        <div className="card card-produto">
          <div className="card-icon-produto">
            <Wind size={32} color="#7c5cbf" />
          </div>
          <h4>Secadora</h4>
        </div>
        <div className="card card-produto">
          <div className="card-icon-produto">
            <PawPrint size={32} color="#e8803a" />
          </div>
          <h4>Lavadora Pet</h4>
        </div>
      </div>
      <div className="btn-container">
        <button className="btn-acompanhar">Acompanhar Lavagem</button>
      </div>
    </main>
  );
}
