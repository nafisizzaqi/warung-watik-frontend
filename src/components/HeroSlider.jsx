import { useEffect, useState } from "react";

export default function HeroSlider({title}) {
    const images = [
        "/assets/bg-1.jpg",
        "/assets/bg-2.jpg",
        "/assets/bg-3.jpg",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="h-screen w-full bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
        >
            <div className="h-full w-full flex flex-col items-center justify-center bg-black/40">
                <h1 className="text-5xl font-bold drop-shadow-lg mb-4 text-white">{title}</h1>
                {/* <h1 className="text-white text-7xl font-bold">Warung Watik</h1> */}
            </div>
        </div>
    );
}
