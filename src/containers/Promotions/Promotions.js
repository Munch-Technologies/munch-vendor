import { ArrowLeft, Coupon } from "assets/icons";
import { phonescreen } from "assets/images";
import React from "react";
import { Link } from "react-router-dom";

const Promotion = () => {
  return (
    <div className="promotions">
      <div className="promotions__title">
        <h3>Promotions</h3>
      </div>

      <div className="promotions__cards">
        <div className="promotions__cards-offer">
          <div className="offer">
            <div className="buttontext">Create Offers for Restaurants</div>
            <div className="bodytext">
              Create mouth-watering discounts on menu items. This can help your
              restaurant engage users, boost visibility and sales.
            </div>
            <Link to={"/promotions/create"} className="offer-btn">
              <h4>
                Go{" "}
                <span>
                  <ArrowLeft stroke={"#00a642"} />
                </span>
              </h4>
            </Link>
          </div>
          <div className="offer-tag">
            <Coupon />
          </div>
        </div>

        <div className="promotions__cards-highlight">
          <div className="highlight">
            <div className="buttontext">Munch Highlights</div>
            <div className="bodytext">
              Send highlights to consumers. Share stories about your store, your
              recipes or a promotion.
            </div>
            <Link to={"/promotions/highlight"} className="highlight-btn">
              <h4>
                Go{" "}
                <span>
                  <ArrowLeft stroke={"white"} />
                </span>
              </h4>
            </Link>
          </div>
          <div className="phone">
            <img src={phonescreen} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotion;
