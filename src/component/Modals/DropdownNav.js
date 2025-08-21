import React, { useState } from "react";
import "../../assets/css/dropdownNav.css";
import birth1 from "../../assets/images/TopSellers/birthdaytop1.jpg";
import birth2 from "../../assets/images/TopSellers/birthdaytop2.jpg";
import birth3 from "../../assets/images/TopSellers/birthdaytop3.jpg";
import birth4 from "../../assets/images/TopSellers/birthdaytop4.jpg";
import aniv1 from "../../assets/images/TopSellers/aniv1.jpg";
import aniv2 from "../../assets/images/TopSellers/aniv2.jpg";
import aniv3 from "../../assets/images/TopSellers/aniv3.jpg";
import aniv4 from "../../assets/images/TopSellers/aniv4.jpg";
import cd1 from "../../assets/images/cd1.jpg";
import cd2 from "../../assets/images/cd2.jpg";
import de1 from "../../assets/images/TopSellers/de1.jpg";
import de2 from "../../assets/images/TopSellers/de2.jpg";
import de3 from "../../assets/images/TopSellers/de3.jpg";
import de4 from "../../assets/images/TopSellers/de4.jpg";
import fes1 from "../../assets/images/TopSellers/fes1.jpg";
import fes2 from "../../assets/images/TopSellers/fes2.jpg";
import fes3 from "../../assets/images/TopSellers/fes3.jpg";
import fes4 from "../../assets/images/TopSellers/fes4.jpg";
import kid1 from "../../assets/images/TopSellers/kd1.jpg";
import kid2 from "../../assets/images/TopSellers/kd2.jpg";
import kid3 from "../../assets/images/TopSellers/kd3.jpg";
import kid4 from "../../assets/images/TopSellers/kd4.jpg";
import { useNavigate } from "react-router-dom";


const NavigationDropdown = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const navigate = useNavigate();
    const menuData = {
        Birthday: {
            "CANDLELIGHT DINNERS": [
                "Private Couple Experiences",
                "Rooftop Dinners",
                "Poolside Candlelight Dinners",
                "Private Dinner & Movie",
            ],
            "BIRTHDAY DECORATIONS": [
                "Birthday Decors for Him",
                "Birthday Decors for Her",
                "1st Birthday Decorations",
                "18th Birthday Special",
                "Car Boot Decorations",
                "Terrace Decorations",
                "Rosegold Themed Decorations",
                "Kids Themed Decorations",
            ],
            "BIRTHDAY GIFTS": [
                "Bubble Balloon Buckets",
                "Photo Frames",
                "Balloon Box Surprise",
                "Digital Surprises",
                "Cake & Bouquet Combos",
                "Photo Gifts",
                "Heart Shape Cakes",
                "Bouquets",
            ],
            "TOP SELLERS": [
                { title: "White & Gold Floral Birthday Decoration", image: birth1 },
                { title: "Live Guitarist Performance", image: birth2 },
                { title: "Balloon Box Surprise", image: birth3 },
                { title: "Romantic Candlelight Dinner", image: birth4 },
            ],
        },
        Anniversary: {
            "CANDLELIGHT DINNERS": [
                "Private Couple Experiences",
                "Rooftop Dinners",
                "Poolside Candlelight Dinners",
                "Private Dinner & Movie",
            ],
            "DECORATIONS": [
                "Anniversary Party Decors",
                "Hotel Room Decoration",
                "1st Anniversary Decors",
                "25th Anniversary Decors",
                "50th Anniversary Decors",
                "Canopy Decorations at Home",
                "Wedding Night Decorations",
            ],
            "ANNIVERSARY GIFTS": [
                "Bubble Balloon Buckets",
                "Photo Frames",
                "Balloon Box Surprise",
                "Digital Surprises",
                "Cake & Bouquet Combos",
                "Photo Gifts",
                "Heart Shape Cakes",
                "Bouquets",
            ],
            "TOP SELLERS": [
                { title: "I Love You Balloon Bouquet", image: aniv1 },
                { title: "Elegant Harmony Anniversary Decoration", image: aniv2 },
                { title: "Boho Canopy Decoration", image: aniv3 },
                { title: "Personalised Photoframe", image: aniv4 },
            ],
        },
        "Candlelight Dinners": {
            "TRENDING": [
                { title: "Open Air Poolside Candlelight Dinner", image: cd1 },
            ],
            "CATEGORIES": [
                "Private Couple Experiences",
                "Rooftop Dinners",
                "Poolside Candlelight Dinners",
                "Private Dinner & Movie",
            ],
            "SPOTLIGHT": [
                { title: "Evening Elegance Candlelight Dining", image: cd2 },
            ],
            "OUR RECOMMENDATIONS": [
                "Private Supreme Show Movie Experience",
                "Open Air Poolside Dining",
                "Open Air Candlelight Dinner at Ella Hotel",
                "Rooftop Candlelight Dinner",
                "Dinner on a Swing",
            ],
        },
        Decorations: {
            "BY TYPE": [
                "Balloon Decorations",
                "Rosegold Themed Decorations",
                "Umbrella Decorations",
                "Flower Decorations",
            ],
            "BY OCCASION": [
                "Baby Shower",
                "Kids Birthday Party",
                "Birthday Decorations",
                "Welcome Baby Decorations",
                "Anniversary Decorations",
                "Pre-Wedding Events",
                "First Night Decorations",
                "Festive Decorations",
                "Bachelorette Decorations",
            ],
            "KIDS THEME DECOR": [
                "Minion Theme Decorations",
                "Unicorn Decorations",
                "Superhero Theme Decor",
                "Harry Potter Decorations",
                "Peppa Pig Decorations",
                "All Kids Themes",
            ],
            "TOP SELLERS": [
                { title: "Hexagon Neon Birthday Decoration", image: de1 },
                { title: "Luxury Ring Decoration", image: de2 },
                { title: "Flower Wall Decoration", image: de3 },
                { title: "Balloon Arch Decoration", image: de4 },
            ],
        },
        Festivals: {
            "BY OCCASION": [
                "Lohri Decorations (13th Jan)",
                "Republic Day Decorations (26th Jan)",
                "Valentine's Day Special (14th Feb)",
                "Women's Day Special (8th March)",
                "Holi Decorations (14th March)",
                "Mother's Day Special (11th May)",
                "Father's Day Special (15th June)",
                "Guruji Birthday Setups (7th July)",
                "Independence Day Decorations (15th August)",
                "Ganesh Chaturthi (26th Aug)"
            ],
            "": [
                "Navratri Decorations",
                "Halloween Decorations (31st October)",
                "Karva Chauth Surprises (9th October)",
                "Diwali Decorations & Gifts (18th October)",
                "Christmas Decorations & Gifts (25th December)",
                "New Year Party Decorations & Gifts (1st Jan 2026)",
            ],
            "UPCOMING FESTIVALS": [
                { title: "Mother's Day Special", image: fes1 },
                { title: "Guruji Birthday Setups", image: fes2 },
                { title: "Independence Day Decorations", image: fes3 },
                { title: "Ganesh Chaturthi", image: fes4 },
            ],
        },
        "Kid's Celebrations": {
            "REQUIREMENT": [
                "Decorations",
                "Birthday Activities",
                "All Cakes",
                "Balloon Bouquets",
            ],
            "BY EVENT TYPE": [
                "Kids Birthday Decoration",
                "Welcome Baby Decorations",
                "First Birthday Decorations",
                "Naming Ceremony Decorations",
                "Baby Shower Decorations",
                "Annaprashan Decorations",
            ],
            "TOP SELLERS": [
                { title: "First Birthday Decoration", image: kid1 },
                { title: "Unicorn Theme Decoration", image: kid2 },
                { title: "Superhero Theme Decoration", image: kid3 },
                { title: "Princess Theme Decoration", image: kid4 },
            ],
        }
    };

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    // Helper function to determine if a section has images and how many
    const getImageCount = (items) => {
        return items.filter(item => typeof item === 'object').length;
    };

    const selectCity = window.localStorage.getItem("LennyCity");
    // const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));

    const handleCategory = (item) => {
        navigate("/products", { state: { item, selectCity } });
        window.scrollTo({ top: 150, behavior: "smooth" });
    };

    return (
        <nav className="dropdown-navbar">
            <div className="dropdown-nav-container">
                {Object.keys(menuData).map((menu) => (
                    <div
                        key={menu}
                        className="dropdown-nav-item"
                        onMouseEnter={() => toggleMenu(menu)}
                        onMouseLeave={() => toggleMenu(null)}
                    >
                        <button className="dropdown-nav-button">
                            {menu} <span className="chevron">▼</span>
                        </button>
                        {/* Dropdown */}
                        <div
                            className={`dropdown-nav-dropdown ${activeMenu === menu ? "active" : ""}`}
                        >
                            <div className="dropdown-nav-dropdown-content">
                                {Object.entries(menuData[menu]).map(([category, items], idx) => {
                                    const imageCount = getImageCount(items);
                                    const hasImages = imageCount > 0;

                                    return (
                                        <div key={idx} className="dropdown-nav-dropdown-section">
                                            {category && <h4 className="dropdown-nav-section-title">{category}</h4>}
                                            <ul className={`dropdown-nav-item-list ${hasImages ? 'top-sellers-list' : ''} ${hasImages && imageCount > 1 ? 'multiple-images' : ''} ${hasImages && imageCount === 1 ? 'single-image' : ''}`}>
                                                {items.map((item, i) =>
                                                    typeof item === "string" ? (
                                                        // case: string
                                                        <li key={i}>
                                                            <div className="dropdown-nav-item-link"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => handleCategory({ categoryName: menu.toUpperCase() })}
                                                                // onClick={()=> console.log()}
                                                            >
                                                                {item}
                                                            </div>
                                                        </li>
                                            ) : (
                                            // case: object with image & title
                                            <li key={i} className="dropdown-nav-item-with-image">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="dropdown-nav-item-image"
                                                />
                                                <span>{item.title}</span>
                                            </li>
                                            )
                                                )}
                                        </ul>
                                        </div>
                            );
                                })}
                        </div>
                    </div>
                    </div>
                ))}
        </div>
        </nav >
    );
};

export default NavigationDropdown;