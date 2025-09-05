import React, { useState, useRef, useEffect } from "react";
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
    const [dropdownPosition, setDropdownPosition] = useState({ left: 0 });
    const menuRefs = useRef({});
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const menuData = {
        "BIRTHDAY": {
            "BIRTHDAY": [
                "Birthday Decoration",
                "Simple Birthday Decoration", 
                "Neon & Sequin Birthday Decoration",
                "Terrace Decoration",
                "Car Boot Decoration"
            ],
            "KID'S PARTY": [
                "Kids Birthday Decoration",
                "1st Birthday Decoration",
                "Naming Ceremony Decoration"
            ],
            "TOP SELLERS": [
                { title: "White & Gold Floral Birthday Decoration", image: birth1 },
                { title: "Live Guitarist Performance", image: birth2 },
                { title: "Balloon Box Surprise", image: birth3 },
                { title: "Romantic Candlelight Dinner", image: birth4 },
            ],
        },
        "ANNIVERSARY": {
            "ANNIVERSARY": [
                "Anniversary Decoration",
                "Bride To Be",
                "Haldi-Mehndi Balloon Decoration",
                "Let's Party",
                "Better Together"
            ],
            "ROOM & HALL DECOR'S": [
                "Room & Hall Decor",
                "Canopy Decor"
            ],
            "TOP SELLERS": [
                { title: "I Love You Balloon Bouquet", image: aniv1 },
                { title: "Elegant Harmony Anniversary Decoration", image: aniv2 },
                { title: "Boho Canopy Decoration", image: aniv3 },
                { title: "Personalised Photoframe", image: aniv4 },
            ],
        },
        "BABY SHOWER": {
            "BABY SHOWER": [
                "Baby Shower Decoration",
                "Oh Baby",
                "Welcome",
                "Naming Ceremony"
            ],
            "BALLOON BOUQUET": [
                "Balloon Bouquet"
            ],
            "PREMIUM DECOR'S": [
                "Premium Decor's"
            ],
            "TOP SELLERS": [
                { title: "Baby Shower Decoration", image: de1 },
                { title: "Oh Baby Theme", image: de2 },
                { title: "Welcome Baby", image: de3 },
                { title: "Premium Decor", image: de4 },
            ],
        },
        "THEME DECOR'S FOR BOYS": {
            "POPULAR THEMES": [
                "Boss Baby",
                "Jungle Theme", 
                "Cars",
                "Dinosaur",
                "Peppa Pig",
                "Spiderman",
                "Baby Shark"
            ],
            "ADVENTURE THEMES": [
                "Donut",
                "Cocomelon",
                "Mickey Mouse",
                "Football",
                "Aeroplane",
                "Space"
            ],
            "ACTION THEMES": [
                "Superhero",
                "Teddy",
                "Paw Patrol",
                "Unicorn Theme",
                "Captain America Theme",
                "Minecraft Theme"
            ],
            "TOP SELLERS": [
                { title: "Boss Baby Theme Decoration", image: kid1 },
                { title: "Superhero Theme Decoration", image: kid2 },
                { title: "Cars Theme Decoration", image: kid3 },
                { title: "Spiderman Theme Decoration", image: kid4 },
            ],
        },
        "THEME DECOR'S FOR GIRLS": {
            "PRINCESS THEMES": [
                "Minnie Mouse",
                "Barbie Theme",
                "Frozen",
                "Mermaid",
                "Princess"
            ],
            "MAGICAL THEMES": [
                "Rainbow",
                "Butterfly",
                "Candyland",
                "Masha and the Bear"
            ],
            "TOP SELLERS": [
                { title: "Minnie Mouse Theme Decoration", image: fes1 },
                { title: "Princess Theme Decoration", image: fes2 },
                { title: "Frozen Theme Decoration", image: fes3 },
                { title: "Barbie Theme Decoration", image: fes4 },
            ],
        }
    };

    // Track if mouse is over dropdown
    const [dropdownHover, setDropdownHover] = useState(false);
    const toggleMenu = (menu) => {
        if (menu && menu !== activeMenu) {
            const menuElement = menuRefs.current[menu];
            const containerElement = containerRef.current;
            if (menuElement && containerElement) {
                const menuRect = menuElement.getBoundingClientRect();
                const containerRect = containerElement.getBoundingClientRect();
                const menuCenter = menuRect.left + menuRect.width / 2 - containerRect.left;
                const dropdownWidth = getDropdownWidth(menu);
                let leftPosition = menuCenter - dropdownWidth / 2;
                const maxLeft = containerRect.width - dropdownWidth;
                leftPosition = Math.max(0, Math.min(leftPosition, maxLeft));
                setDropdownPosition({ left: leftPosition });
            }
        }
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    // Close dropdown on scroll
    useEffect(() => {
        const handleScroll = () => setActiveMenu(null);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper function to determine dropdown width based on content
    const getDropdownWidth = (menu) => {
        const menuContent = menuData[menu];
        const sectionCount = Object.keys(menuContent).length;
        
        // Boys theme has 4 sections (3 text + 1 image), girls has 3 sections (2 text + 1 image)
        if (menu === "THEME DECOR'S FOR BOYS") {
            return Math.min(800, sectionCount * 160 + 40); // 4 sections * 160px + padding
        } else if (menu === "THEME DECOR'S FOR GIRLS") {
            return Math.min(650, sectionCount * 160 + 40); // 3 sections * 160px + padding
        } else {
            return Math.min(700, sectionCount * 160 + 40); // Default width
        }
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
            <div className="dropdown-nav-container" ref={containerRef}>
                {Object.keys(menuData).map((menu) => (
                    <div
                        key={menu}
                        className="dropdown-nav-item"
                        ref={(el) => (menuRefs.current[menu] = el)}
                        onMouseEnter={() => toggleMenu(menu)}
                        onMouseLeave={() => { if (!dropdownHover) toggleMenu(null); }}
                    >
                        <button className="dropdown-nav-button">
                            {menu} <span className="chevron">▼</span>
                        </button>
                        {/* Dropdown with Smart Positioning */}
                        <div
                            className={`dropdown-nav-dropdown ${activeMenu === menu ? "active" : ""}`}
                            style={{
                                left: activeMenu === menu ? `${dropdownPosition.left}px` : '0',
                                width: activeMenu === menu ? `${getDropdownWidth(menu)}px` : 'auto'
                            }}
                            onMouseEnter={() => setDropdownHover(true)}
                            onMouseLeave={() => { setDropdownHover(false); toggleMenu(null); }}
                        >
                            <div className={`dropdown-nav-dropdown-content ${
                                menu === "THEME DECOR'S FOR BOYS" ? "boys-theme" : 
                                menu === "THEME DECOR'S FOR GIRLS" ? "girls-theme" : ""
                            }`}>
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
                                                                onClick={() => handleCategory({
                                                                    categoryName: menu.toUpperCase().replace("'S", "S"),
                                                                    subcategory: item
                                                                })}
                                                            >
                                                                {item}
                                                            </div>
                                                        </li>
                                                    ) : (
                                                        // case: object with image & title
                                                        <li key={i} className="dropdown-nav-item-with-image"
                                                            onClick={() => handleCategory({
                                                                categoryName: menu.toUpperCase().replace("'S", "S"),
                                                                subcategory: item.title
                                                            })}
                                                            style={{ cursor: "pointer" }}
                                                        >
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