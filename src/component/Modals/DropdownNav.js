import React, { useState } from "react";
import "../../assets/css/dropdownNav.css";
import birth1 from "../../assets/images/TopSellers/birthdaytop1.jpg";
import birth2 from "../../assets/images/TopSellers/birthdaytop2.jpg";
import birth3 from "../../assets/images/TopSellers/birthdaytop3.jpg";
import birth4 from "../../assets/images/TopSellers/birthdaytop4.jpg";
const NavigationDropdown = () => {
    const [activeMenu, setActiveMenu] = useState(null);

    const menuData = {
        Birthdays: {
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
            // "TOP SELLERS": [
            //     { title: "I Love You Balloon Bouquet", image: birth1 },
            //     { title: "Elegant Harmony Anniversary Decoration", image: birth2 },
            //     { title: "Boho Canopy Decoration", image: birth3 },
            //     { title: "Personalised Photoframe", image: birth4 },
            // ],
        }, Anniversary: {
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
            FEATURED: [
                "Golden Anniversary Setup",
                "Rose Petal Arrangements",
                "Candlelit Experiences",
                "Custom Love Letters",
            ],
        }, "Candlelight Dinners": {
            "DINNER EXPERIENCES": [
                "Rooftop Candlelight",
                "Poolside Romance",
                "Private Venues",
                "Home Setup",
            ],
            LOCATIONS: [
                "Beachside Dinners",
                "Garden Settings",
                "Terrace Views",
                "Indoor Ambiance",
            ],
            SPOTLIGHT: [
                "Romantic Proposal Setup",
                "Anniversary Dinner",
                "Date Night Special",
                "Celebration Package",
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
                "Superhero Theme Decorations",
                "Harry Potter Decorations",
                "Peppa Pig Decorations",
                "All Kids Themes",
            ],
            TRENDING: [
                "Balloon Arrangements",
                "Floral Displays",
                "Light Decorations",
                "Theme Parties",
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
                ,
                "Navratri Decorations",
                "Halloween Decorations (31st October)",
                "Karva Chauth Surprises (9th October)",
                "Diwali Decorations & Gifts (18th October)",
                "Christmas Decorations & Gifts (25th December)",
                "New Year Party Decorations & Gifts (1st Jan 2026)",
            ],
            "Top Sellers": [

            ]
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
            POPULAR: [
                "Unicorn Theme Party",
                "Superhero Adventure",
                "Disney Princess",
                "Sports Theme Celebration",
            ],
        }
    };

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <nav className="dropdown-navbar" >
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
                            className={`dropdown-nav-dropdown ${activeMenu === menu ? "active" : ""
                                }`}
                        >
                            <div className="dropdown-nav-dropdown-content">
                                {Object.keys(menuData[menu]).map((category, idx) => (
                                    <div key={idx} className="dropdown-nav-dropdown-section">
                                        <h4 className="dropdown-nav-section-title">{category}</h4>
                                        <ul className="dropdown-nav-item-list">
                                            {menuData[menu][category].map((item, i) =>
                                                typeof item === "string" ? (
                                                    // case: string
                                                    <li key={i}>
                                                        <a href="#" className="dropdown-nav-item-link">
                                                            {item}
                                                        </a>
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
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </nav >
    );
};

export default NavigationDropdown;
