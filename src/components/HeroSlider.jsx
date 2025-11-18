import { useEffect, useState } from "react";

// HeroSlider.js
export default function HeroSlider({ title }) {
    const images = ["/assets/bg-1.jpg", "/assets/bg-2.jpg", "/assets/bg-3.jpg"];
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
            className="w-full h-screen bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
        >
            <div className="h-full w-full flex flex-col items-center justify-center bg-black/40 px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg text-center text-white">
                    {title}
                </h1>
            </div>
        </div>
    );
}
