import { useState } from "react";
import TestimonialForm from "./TestimonialForm";
import TestimonialSlider from "./TestimonialSlider";

export default function Testimonials() {
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleSubmitted = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-8">
      <div className="flex py-10 min-h-screen gap-32">
      <TestimonialForm onSubmitted={handleSubmitted} />
      <TestimonialSlider reloadTrigger={reloadTrigger} />
    </div>
    </div>
  );
}
