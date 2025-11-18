import { useState } from "react";
import TestimonialForm from "./TestimonialForm";
import TestimonialSlider from "./TestimonialSlider";

export default function Testimonials() {
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleSubmitted = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row py-10 min-h-screen gap-10 sm:gap-32">
        <div className="w-full sm:w-1/3">
          <TestimonialForm onSubmitted={handleSubmitted} />
        </div>
        <div className="w-full sm:w-2/3">
          <TestimonialSlider reloadTrigger={reloadTrigger} />
        </div>
      </div>
    </div>
  );
}
