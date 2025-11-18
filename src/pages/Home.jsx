import Layout from "../components/Layout/Layout";
import Testimonials from "../components/Testimonials";

export default function Home({ user }) {
  return (
    <div className="text-white text-center mt-10">
      <Testimonials />
    </div>
  );
}
