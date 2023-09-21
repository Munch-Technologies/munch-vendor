import { Pleased, PlusIcon, ThreeDot } from "assets/icons";
// import {
//   highlight1,
//   highlight2,
//   highlight3,
//   highlight4,
//   munchHighlightLogo,
// } from "assets/images";
import {
  Button,
  Card,
  CustomDropdown,
  ErrorButton,
  FullPageSpinner,
  Image,
} from "components";
import produce from "immer";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useClient } from "utils/apiClient";
import getTimeAgo from "utils/timeAgo";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  CSSTransition,
  Transition,
  TransitionGroup,
} from "react-transition-group";

// const highlights = {
//   highlights: [
//     {
//       id: 1,
//       image: highlight1,
//       created_at: "2022-06-06T21:10:10.884Z",
//       author: {
//         id: 1,
//         name: "Munch",
//         avatar: munchHighlightLogo,
//       },
//     },
//     {
//       id: 2,
//       image: highlight2,
//       created_at: "2022-06-06T21:10:10.884Z",
//       author: {
//         id: 1,
//         name: "Munch",
//         avatar: munchHighlightLogo,
//       },
//     },
//     {
//       id: 3,
//       image: highlight3,
//       created_at: "2022-06-06T21:10:10.884Z",
//       author: {
//         id: 1,
//         name: "Munch",
//         avatar: munchHighlightLogo,
//       },
//     },
//     {
//       id: 4,
//       image: highlight4,
//       created_at: "2022-06-06T21:10:10.884Z",
//       author: {
//         id: 1,
//         name: "Munch",
//         avatar: munchHighlightLogo,
//       },
//     },
//   ],
// };

const CreateHighlight = () => {
  const client = useClient();
  const queryClient = useQueryClient();

  const { data, isLoading, isIdle, isError, error } = useQuery(
    ["highlights"],
    () => {
      return client("admin/promotions/highlights");
    }
  );

  const {
    mutate,
    isError: mutateIsError,
    error: mutateError,
  } = useMutation(
    (highlightId) => {
      return client(`admin/promotions/highlight/${highlightId}`, {
        method: "DELETE",
      });
    },
    {
      onMutate: (highlightId) => {
        queryClient.setQueryData(["highlights"], (old) =>
          produce(old, (draft) => {
            draft = draft.filter((highlight) => highlight.id !== highlightId);
          })
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["highlights"]);
      },
    }
  );

  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const sliderRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingTimeRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (!data) return;
    if (firstRender.current) {
      setTimeout(() => {
        setShowSlider(true);
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
          sliderRef.current.slickNext();
        }, 3500);
      }, 500);
    } else {
      if (paused) {
        clearTimeout(timerRef.current);
        remainingTimeRef.current = 3000 - (Date.now() - startTimeRef.current);
      } else {
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
          if (slideIndex === data?.length - 1) {
            setShowSlider(false);
          } else {
            sliderRef.current.slickNext();
          }
        }, remainingTimeRef.current);
      }
    }
    firstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, data]);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    autoplay: false,
    speed: 200,
    autoplaySpeed: 2000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => {
      setSlideIndex(index);
      clearTimeout(timerRef.current);
      if (index < data.length - 1) {
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
          sliderRef.current.slickNext();
        }, 3000);
      } else {
        // close slider
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
          setShowSlider(false);
        }, 3000);
      }
    },
    beforeChange: (current, next) => {
      clearTimeout(timerRef.current);
    },
  };

  const deleteHighlight = (id) => {
    mutate(id);
  };

  const showHighlight = (index) => {
    setShowSlider(true);
    setSlideIndex(index);
    console.log("calling slick goto", sliderRef.current);
    sliderRef.current.slickGoTo(index);
    clearTimeout(timerRef.current);
  };
  const reportHighlight = (id) => {
    console.log("reportHighlight", id);
  };

  if (isError) throw error;

  return (
    <div className="promotions__create">
      <h1 className="title">Munch Highlights</h1>
      <div className="bodytext">
        Share your stories, recipes or even a promotion.{" "}
      </div>
      <Link to={"/promotions/highlight/create"}>
        <div className={"create-button"}>
          <Button
            className={"button"}
            titleClass="create-button-text"
            title="Create New Highlights"
            iconLeft={<PlusIcon />}
          />
        </div>
      </Link>
      <div>
        <h4>Current Highlight</h4>

        {mutateIsError && (
          <p className="errorMessage">
            <ErrorButton /> {mutateError.message}
          </p>
        )}
        {isIdle || isLoading ? (
          <Card>
            <FullPageSpinner containerHeight="20rem" />
          </Card>
        ) : data?.length ? (
          <div className="highlight">
            <Transition in={showSlider} timeout={0}>
              {(state) => (
                <div className={`highlight_slider ${state}`}>
                  <Slider {...settings} ref={sliderRef}>
                    {data.map((highlight) => (
                      <div key={highlight.id}>
                        <Image
                          key={highlight.id}
                          className="highlight_slider-image"
                          src={highlight.image}
                          alt={`${highlight.author.name} ${highlight.id}`}
                        >
                          <div className="highlight_slider-controls">
                            <div className="head">
                              <Image
                                className="head-image"
                                src={highlight.author.avatar}
                                alt={highlight.author.name}
                              />
                              <span className="head-name">
                                {highlight.author.name}
                              </span>
                              <span className="head-time">
                                {getTimeAgo(new Date(highlight.created_at))}
                              </span>
                              <CustomDropdown
                                className="head-dropdown"
                                align="right"
                                header={<ThreeDot fill="#ffffff" />}
                                small
                                onOpenClose={(isOpen) => setPaused(isOpen)}
                                list={[
                                  {
                                    text: "Report Highlight",
                                    value: "report",
                                    available: true,
                                  },
                                  {
                                    text: "Delete Highlight",
                                    value: "delete",
                                    className: "delete",
                                    available: true,
                                  },
                                ]}
                                onSelect={(value) => {
                                  if (value === "delete") {
                                    deleteHighlight(highlight.id);
                                  } else if (value === "report") {
                                    reportHighlight(highlight.id);
                                  }
                                }}
                              />
                            </div>
                            <div
                              className="left"
                              onClick={() => sliderRef.current.slickPrev()}
                            ></div>
                            <div
                              className="right"
                              onClick={() => sliderRef.current.slickNext(0)}
                            ></div>
                            <div className="overlay"></div>
                          </div>
                        </Image>
                      </div>
                    ))}
                  </Slider>
                  <div className="highlight_slider-count">
                    {data.map((_, index) => (
                      <span
                        key={index}
                        className={`${
                          slideIndex > index || !showSlider ? "visited" : ""
                        } ${slideIndex === index ? "active" : ""} ${
                          paused ? "paused" : ""
                        } ${state}`}
                      ></span>
                    ))}
                  </div>
                </div>
              )}
            </Transition>

            <TransitionGroup className="highlight_list">
              {data.map((highlight, index) => (
                <CSSTransition
                  className="highlight_list-itemWrap"
                  key={highlight.id}
                  timeout={500}
                >
                  <div
                    className="highlight_list-item"
                    onClick={(e) => {
                      showHighlight(index);
                    }}
                  >
                    <Image
                      src={highlight.image}
                      alt={`${highlight.author.name} ${highlight.id}`}
                      className="highlight_list-item-image"
                    />
                    <span className="highlight_list-item-time">
                      {getTimeAgo(new Date(highlight.created_at))}
                    </span>
                    <button
                      className="highlight_list-item-delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // console.log("running delete", highlight.id);
                        deleteHighlight(highlight.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
        ) : (
          <Card>
            <div className="empty">
              <div className="img">
                <Pleased />
              </div>
              <div className="bodytext">
                No Current Highlights. Pass information to consumers through
                highlights. All highlights disappear after a 24-hour period of
                posting
              </div>
              <Link to={"/promotions/highlight/create"}>
                <div className={"create-button"}>
                  <Button
                    className={"button"}
                    titleClass="create-button-text"
                    title="Create New Highlights"
                    iconLeft={<PlusIcon />}
                  />
                </div>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateHighlight;
