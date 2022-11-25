import Feed from "./Feed";
import Footer from "./Footer";
import style from "./Landing.module.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Img1 from "../social-banner.jpg";
import Img2 from "../chatbot.jpg";

export default function Landing() {
  return (
    <div className={style.wrapper}>
      <div className={style.hero}>
        {/* <img src={Img} /> */}
        <Carousel showThumbs={false} className={style.carousel} dynamicHeight={false} swipeable={true} emulateTouch={true}>
          <div>
            <img src={Img1} height="350px" />
          </div>
          <div>
            <img src={Img2} height="350px" />
          </div>
        </Carousel>
      </div>
      <div style={{ maxWidth: "1200px", display: "flex" }}>
        <Feed noPost />
        <div className={style.socialBenefits}>
          <p>Benefits of Social Bank</p>
          <ul>
            <li>Request for offers instantly</li>
            <li>Instant query resolution via an interactive chat session</li>
            <li>Provide real-time feedback</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div >
  );
}
