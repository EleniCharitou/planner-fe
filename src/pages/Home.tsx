import BlogContainer from "../components/homepage/BlogContainer";
import BlogHeading from "../components/homepage/BlogHeading";
import Intro from "../components/homepage/Intro";

function Home() {
  return (
    <div>
      <Intro />
      <BlogHeading />
      <BlogContainer />
    </div>
  );
}

export default Home;
