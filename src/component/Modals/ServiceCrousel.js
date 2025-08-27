import React, { useRef } from 'react';
import '../../assets/css/serviceCrousel.css';

const EventServicesApp = () => {
  const servicesData = [
    {
      sectionTitle: "Enjoy Every Moment of Life",
      subtitle: "We offer a variety of services, differing in the total value of needed.",
      services: [
        {
          title: "Helium Balloon",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
           "✨We accept orders starting from ₹1000.",
           "✨Prices vary by package, location, and balloon type (latex/foil).",
           "✨Helium balloons last 8–24 hours (latex) & 2–7 days (foil).",
           "✨Safety: Helium is non-flammable & safe for indoor/outdoor use.",
           "✨Advance booking is recommended."

          ]
        },
        {
          title: "Advertising PVC Sky Balloon",
          image: "https://t4.ftcdn.net/jpg/01/20/28/25/360_F_120282530_gMCruc8XX2mwf5YtODLV2O1TGHzu4CAb.jpg",
          features: [
            "✨A large outdoor advertising balloon made from strong PVC material.",
            "✨Printed with brand logo, company name, or promotional message.",
            "✨24/7 outdoor visibility.",
            "✨Advance booking recommended."

          ]
        },
        {
          title: "Balloon Printing",
          image: "https://marketplace.canva.com/EAE-WZrX7uc/1/0/1600w/canva-happy-anniversary-%28card-%28landscape%29%29-yjXfT0pKATM.jpg",
          features: [
            "✨Custom Logo Printing – Company logos for advertising campaigns.",
            "✨Promotional Balloon Printing – Malls, political rallies, product launches.",
            "✨Minimum Order Value: ₹10000 (or as per package).",
            "✨Advance booking recommended."

          ]
        },
        {
          title: "Wholesale Balloon",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQon2gFsM-89H13ZXaz2mpwaZ1zVuYGH1K8Vg&s",
          features: [
            "✨Minimum Wholesale Order: ₹50000 (or as per quantity)",
            "✨Home delivery option (for large orders / local area)",
            "✨Available in 5\", 9\", 12\", 18\"+ sizes",
            "✨Standard, Metallic, Chrome, Pastel & Printed options",
            "✨Can be filled with air or helium",
            "✨Advance booking recommended"
          ]
        },
        {
          title: "🎈 Balloon Artist",
          image: "https://burst.shopifycdn.com/photos/dj-crowd.jpg?width=1000&format=pjpg&exif=0&iptc=0",
          features: [
            "✨ Creative balloon animals, hats & cartoon shapes",
            "✨ Keeps kids engaged with fun activities",
            "✨ Perfect for birthdays, schools & family events",
            "✨ Secure your date in advance for hassle-free service"

          ]
        },
        {
          title: "🎶 DJ",
          image: "https://media.istockphoto.com/id/1292256043/photo/fast-delivery-truck-travelling-through-the-city-streets.jpg?s=612x612&w=0&k=20&c=ndH4s7k1UHpadvoavYT29mhdzWWkX1hf4_nqj70ELJY=",
          features: [
            "✨ High-energy music & dance floor lighting",
            "✨ Latest Bollywood, Hollywood & party mixes",
            "✨ Best choice for birthdays, weddings & corporate parties",
            "✨ Secure your date in advance for hassle-free service"
          ]
        },
        {
          title: "📸 Photographer",
          image: "https://media.istockphoto.com/id/625736338/photo/stack-of-hands-showing-unity.jpg?s=612x612&w=0&k=20&c=20mAQjGRQ5XVKqHe2qFguqGZ4dwto6lxxinciCfnVI0=",
          features: [
            "✨ Professional photography & candid shots",
            "✨ Event coverage with edited albums & reels",
            "✨ Capture every memory with style & quality",
            "✨ Secure your date in advance for hassle-free service"

          ]
        },
        {
          title: "🐻 Mascot",
          image: "https://mattersindia.com/wp-content/uploads/2024/04/stress-free.jpg",
          features: [
            "✨ Cartoon mascots like Mickey, Doraemon, Chhota Bheem",
            "✨ Fun interaction & photo opportunities",
            "✨ Loved by kids at birthdays & mall events",
            "✨ Secure your date in advance for hassle-free service"

          ]
        },
        {
          title: "🎤 Anchor",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "✨ Professional hosting for smooth events",
            "✨ Engaging games, guest interaction & announcements",
            "✨ Available in English & Hindi",
            "✨ Secure your date in advance for hassle-free service"

          ]
        },
        {
          title: "🎩 Magicians",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "✨ Fun stage shows & close-up tricks",
            "✨ Interactive magic for kids & adults",
            "✨ Add amazement to birthdays, schools & parties",
            "✨ Secure your date in advance for hassle-free service"

          ]
        },
        {
          title: "🎨 Tattoo Artist",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "✨ Stylish temporary tattoos for kids & adults",
            "✨ Glitter & airbrush tattoo options",
            "✨ Safe, skin-friendly & easily removable",
            "✨ Secure your date in advance for hassle-free service"

          ]
        }
      ]
    },
    {
      sectionTitle: "Wedding Entry",
      subtitle: "We offer a variety of services, differing in the total value of needed.",
      services: [
        {
          title: "❄️ Dry Ice Fog Machine",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "✨ Creates a magical low-lying fog effect",
            "✨ Perfect for dance entries, weddings & stage shows",
            "✨ Adds a dreamy touch to photos & videos",
            "✨ Secure your date in advance for hassle-free service"
          ]
        },
        {
          title: "🎈 Balloon Blasting",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "✨ Grand balloon drop or blast effect",
            "✨ Ideal for birthdays, inaugurations & countdowns",
            "✨ Instant celebration vibe with a surprise burst",
            "✨ Secure your date in advance for hassle-free service"
          ]
        },
        {
          title: "🔥 Pyro Effects",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "✨ Sparkle showers & cold fire pyros",
            "✨ Safe indoor/outdoor use for parties & weddings",
            "✨ Makes stage entries & cake cutting unforgettable",
            "✨ Secure your date in advance for hassle-free service"
          ]
        },
        {
          title: "🫧 Bubble Machine",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "✨ Endless stream of bubbles for kids & adults",
            "✨ Creates a fun, fairy-tale environment",
            "✨ Perfect for birthdays, baby showers & outdoor events",
            "✨ Secure your date in advance for hassle-free service"

          ]
        }
      ]
    }
  ];

  const handleEnquiry = (serviceName) => {
    const message = `Hello! I am interested in your ${serviceName} service.`;
    const whatsappUrl = `https://wa.me/971512345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const scrollLeft = (ref) => {
    ref.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = (ref) => {
    ref.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const ServiceCard = ({ service }) => (
    <div className="service-card">
      <img 
        src={service.image} 
        alt={service.title}
        className="service-card-image"
      />
      <h2 className="service-card-title">{service.title}</h2>
      <ul className="service-card-features">
        {service.features.map((feature, index) => (
          <li key={index} className="service-card-feature">{feature}</li>
        ))}
      </ul>
      <button 
        onClick={() => handleEnquiry(service.title)}
        className="service-card-button"
      >
        Enquiry Now
      </button>
    </div>
  );

  const ServiceSection = ({ section, index }) => {
    const scrollRef = useRef(null);
    
    return (
      <div className="service-section">
        <h1 className="section-title-service">
          <span>
            {section.sectionTitle.split(' ').map((word, wordIndex) => {
              const isHighlighted = ['Life', 'Balloons', 'Artist', 'Entry'].includes(word);
              return (
                <span key={wordIndex} className={isHighlighted ? 'highlight-text' : ''}>
                  {word}{wordIndex < section.sectionTitle.split(' ').length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </span>
        </h1>
        <p className="section-subtitle">{section.subtitle}</p>
        
        <div className="scroll-container">
          {/* Left Arrow */}
          <button 
            onClick={() => scrollLeft(scrollRef)}
            className="scroll-arrow scroll-arrow-left"
          >
            ←
          </button>
          
          {/* Right Arrow */}
          <button 
            onClick={() => scrollRight(scrollRef)}
            className="scroll-arrow scroll-arrow-right"
          >
            →
          </button>
          
          {/* Horizontal Scrollable Container */}
          <div 
            ref={scrollRef}
            className="horizontal-scroll"
          >
            {section.services.map((service, serviceIndex) => (
              <ServiceCard key={serviceIndex} service={service} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
  
      {/* Main Content */}
      <div className="main-content">
        {servicesData.map((section, index) => (
          <ServiceSection key={index} section={section} index={index} />
        ))}
      </div>
    </div>
  );
};

export default EventServicesApp;