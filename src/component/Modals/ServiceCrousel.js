import React, { useRef } from 'react';
import '../../assets/css/serviceCrousel.css';

const EventServicesApp = () => {
  const servicesData = [
    {
      sectionTitle: "Enjoy Every Moment of Life",
      subtitle: "We offer a variety of services, differing in the total value of needed.",
      services: [
        {
          title: "Decoration",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉Choose unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉Get your venue decorated in just 2 hours, indoors or outdoors.",
            "🎉Best prices, timely service, and support",
            "✨4.6⭐ Rating..."
          ]
        },
        {
          title: "Wavy Feel",
          image: "https://t4.ftcdn.net/jpg/01/20/28/25/360_F_120282530_gMCruc8XX2mwf5YtODLV2O1TGHzu4CAb.jpg",
          features: [
            "😜Skyrixe let you feel the Wave",
            "👨They use your ingredients and utensils 👀",
            "🍿Experience 400 restaurant-style dishes.🍽",
            "❤Affordable & customizable.💰",
            "🧧Full hygiene control.🧼",
            "✨4.9 ⭐ Rating..."
          ]
        },
        {
          title: "Anniversary",
          image: "https://marketplace.canva.com/EAE-WZrX7uc/1/0/1600w/canva-happy-anniversary-%28card-%28landscape%29%29-yjXfT0pKATM.jpg",
          features: [
            "🧡Enjoy Anniversary",
            "🚴‍♂Best prices, Timely service",
            "💤Delicious taste",
            "🚴‍♂Good packing",
            "🚴‍♂Guaranteed support",
            "✨5⭐ Rating..."
          ]
        },
        {
          title: "Live Catering",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQon2gFsM-89H13ZXaz2mpwaZ1zVuYGH1K8Vg&s",
          features: [
            "🍽Enjoy the full buffet/Catering setup with hot and fresh food cooked by professional chefs starting @300 per plate",
            "🍽Professional. Timely services..."
          ]
        },
        {
          title: "Entertainment",
          image: "https://burst.shopifycdn.com/photos/dj-crowd.jpg?width=1000&format=pjpg&exif=0&iptc=0",
          features: [
            "🎶Make your event unforgettable by engaging your guests! Choose from over 10 amazing services:",
            "👌Guaranteed Entertainment"
          ]
        },
        {
          title: "Fast Delivery",
          image: "https://media.istockphoto.com/id/1292256043/photo/fast-delivery-truck-travelling-through-the-city-streets.jpg?s=612x612&w=0&k=20&c=ndH4s7k1UHpadvoavYT29mhdzWWkX1hf4_nqj70ELJY=",
          features: [
            "🎶Make your event unforgettable by engaging your guests! Choose from over 10 amazing services:",
            "🚌Delivery on time"
          ]
        },
        {
          title: "Super Support",
          image: "https://media.istockphoto.com/id/625736338/photo/stack-of-hands-showing-unity.jpg?s=612x612&w=0&k=20&c=20mAQjGRQ5XVKqHe2qFguqGZ4dwto6lxxinciCfnVI0=",
          features: [
            "🎶Make your event unforgettable by engaging your guests! Choose from over 10 amazing services:",
            "👏Supporting staff"
          ]
        },
        {
          title: "Tension Free",
          image: "https://mattersindia.com/wp-content/uploads/2024/04/stress-free.jpg",
          features: [
            "🎶Make your event unforgettable by engaging your guests! Choose from over 10 amazing services:",
            "🎶Tattoo Artist"
          ]
        },
        {
          title: "Advertising PVC Sky Balloon",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },
        {
          title: "Balloon Printing",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },
        {
          title: "Wholesale Balloon",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },

        {
          title: "DJ",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },
        {
          title: "Photographer",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },
        {
          title: "Mascot",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },
        {
          title: "Anchors",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },
        {
          title: "Magicians",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },
        {
          title: "Tattoo Artist",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        }
      ]
    },
    {
      sectionTitle: "Wedding Entry",
      subtitle: "We offer a variety of services, differing in the total value of needed.",
      services: [
        {
          title: "Dry Ice Fog Machine",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },
        {
          title: "Balloon Blasting",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },
        {
          title: "Pyro",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
          ]
        },
        {
          title: "Bubble Machine",
          image: "https://www.imgworldstickets.ae/blog/wp-content/uploads/2023/01/birthday-parties-at-IMG.jpg",
          features: [
            "🎉 Unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!",
            "🎉 Venue decorated in just 2 hours (indoors or outdoors).",
            "🎉 Best prices, timely service, and support",
            "✨ Rated 4.6⭐"
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