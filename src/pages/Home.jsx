import Layout from "../components/Layout/Layout";
import Testimonials from "../components/Testimonials";

export default function Home({ user }) {
  return (
    // <Layout>
    <div className="text-white text-center mt-10">
      {/* <h1 className="text-3xl mb-6">Welcome, {user.name}</h1> */}
      <Testimonials />
    </div>
    // </Layout>
  );
}
