import BlogContainer from "../components/homepage/BlogContainer";
import BlogHeading from "../components/homepage/BlogHeading";
import Footer from "../components/Footer";
import Intro from "../components/homepage/Intro";

function Home() {
  return (
    <div>
      <Intro />
      <BlogHeading />
      <BlogContainer />
      <Footer />
    </div>
  );
}

export default Home;
