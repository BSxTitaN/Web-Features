import { Calendar, MinusCircle, Search, X } from "react-feather";
import styled from "styled-components";
import TopBar from "../topBar";
import { useEffect, useState } from "react";
import { db } from "../../../Firebase/main";
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { toast } from "react-toastify";
import Image from "next/image";
import FooterMain from "../footerMain";

export default function CompIn() {
  const [posts, setPosts] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "Complaints"),
      orderBy("date", "desc"),
      limit(60)
    );
    const subscriber = onSnapshot(q, (querySnapshot) => {
      const getPostsFromFirebase = [];
      querySnapshot.forEach((doc) => {
        getPostsFromFirebase.push({
          ...doc.data(), //spread operator
          key: doc.id, // `id` given to us by Firebase
        });
      });
      setPosts(getPostsFromFirebase);
      setLoading(false);
    });

    return () => subscriber();
  }, [posts.length]);

  if (loadings) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "25%",
          marginLeft: "50%",
        }}
      >
        <ClipLoader color="#111111" loading={loadings} />
      </div>
    );
  }

  const searchItems = (searchValue, blur = false) => {
    setSearchInput(searchValue);
    if (searchInput !== "" || blur) {
      const filteredData = posts.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      if (filteredData.length != 0) {
        // Show "404 not found" div
        <div className="nodata">
          <Image
            width={500}
            height={500}
            className="nodimg"
            src="/notice/nodata2.png"
            alt="nodata"
          />
          <h1>No Complaints Yet!</h1>
        </div>;
      }

      setFilteredResults(filteredData);
    } else {
      setFilteredResults(posts);
    }
  };

  const handleBlur = () => {
    searchItems(searchInput, true);
  };

  const resetInputField = () => {
    setSearchInput("");
  };

  return (
    <CompIndex className="SecContainer">
      <TopBar pageName={"Complaints"} />

      <div className="searchie">
        <Search />
        <input
          type="text"
          placeholder="Search for something...."
          value={searchInput}
          name="searchInput"
          onBlur={handleBlur}
          onChange={(e) => searchItems(e.target.value)}
        />
        {searchInput != "" ? (
          <div style={{ cursor: "pointer" }}>
            <X onClick={resetInputField} />
          </div>
        ) : null}
      </div>

      <div className="cmid">
        <div className="cmidHead">
          <h2>The Complaints Handle</h2>
        </div>

        <div className="cmidList">
          {searchInput.length > 1 ? (
            filteredResults.map((post) => (
              <div className="cmidCard" key={post.key}>
                <div className="left">
                  <div className="upper">
                    <Image width={500} height={500} src={post.photo} alt="" />
                    <h3>
                      {post.name} |{" "}
                      <Link
                        className="hover:underline"
                        href={`mailto:${post.mail}`}
                      >
                        {post.mail}
                      </Link>{" "}
                      |{" "}
                      <Link
                        className="hover:underline"
                        href={`whatsapp://send?phone=${post.number}`}
                      >
                        {post.number}
                      </Link>{" "}
                    </h3>
                    <p>{post.reason}</p>
                  </div>

                  <div className="down">
                    <Calendar />
                    <p>{post.date.toDate().toDateString()}</p>
                  </div>
                </div>

                <div className="right">
                  <MinusCircle
                    onClick={() => {
                      deleteDoc(doc(db, "Complaints", post.key));
                      toast.error("Complaints Removed!", {
                        position: "bottom-left",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    }}
                  />
                </div>
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div className="cmidCard" key={post.key}>
                <div className="left">
                  <div className="upper">
                    <Image width={500} height={500} src={post.photo} alt="" />
                    <h3>
                      {post.name} |{" "}
                      <Link
                        className="hover:underline"
                        href={`mailto:${post.mail}`}
                      >
                        {post.mail}
                      </Link>{" "}
                      |{" "}
                      <Link
                        className="hover:underline"
                        href={`whatsapp://send?phone=${post.number}`}
                      >
                        {post.number}
                      </Link>{" "}
                    </h3>
                    <p>{post.reason}</p>
                  </div>

                  <div className="down">
                    <Calendar />
                    <p>{post.date.toDate().toDateString()}</p>
                  </div>
                </div>

                <div className="right">
                  <MinusCircle
                    onClick={() => {
                      deleteDoc(doc(db, "Complaints", post.key));
                      toast.error("Complaints Removed!", {
                        position: "bottom-left",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="nodata">
              <Image
                width={500}
                height={500}
                className="nodimg"
                src="/notice/nodata.png"
                alt="nodata"
              />
              <h1>No Complaints Yet!</h1>
            </div>
          )}
        </div>
      </div>

      <FooterMain />
    </CompIndex>
  );
}

const CompIndex = styled.div`
  .searchie {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e8e9ec;
    max-height: 100px;
    gap: 1em;
    padding: 0.8em 1.3em;
    font-weight: 500;
    font-size: var(--fs-l);
    input {
      min-width: 90%;
      background: none;
      transform: translate(0);
      padding-bottom: 0.05em;
      transition: 0.5s ease-in;
      border-bottom: 1px solid #ffffff;
      &:focus {
        outline: none;
        border-bottom: 1px solid #e6f5fa;
      }
    }
  }

  .cmid {
    margin: 2em;
    flex: 1;
    .cmidHead {
      h2 {
        font-size: calc(var(--fs-m) + 0.2rem);
        font-weight: 700;
      }
    }

    .cmidList {
      display: flex;
      gap: 1em;
      margin-top: 2em;
      flex-wrap: wrap;
      .cmidCard {
        background-color: #f9f8f3;
        padding: 1em;
        min-width: 25rem;
        width: 30%;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        transition: all 0.2s;
        .left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .upper {
            max-width: 25rem;
            width: 100%;
            img {
              border-radius: 50%;
              width: 3em;
              height: 3em;
              margin-bottom: 1em;
            }

            h3 {
              font-weight: 500;
              color: #b4b3ae;
              font-size: var(--fs-s);
            }

            p {
              color: #111111;
              font-weight: 600;
            }
          }

          .down {
            display: flex;
            margin-top: 1em;
            align-items: center;
            gap: 0.5em;
            p {
              font-weight: 700;
              color: #b4b3ae;
              font-size: var(--fs-s);
            }

            svg {
              width: 0.8rem;
            }
          }
        }

        .right {
          svg {
            cursor: pointer;
            &:hover {
              color: #e44235;
            }
          }
        }

        &:hover,
        &:focus {
          box-shadow: 0 0 0 2px #f3f4f9, 0 0 0 4px #111111;
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }

  @media (min-width: 62.5rem) and (max-width: 89rem) {
    .searchie {
      max-height: 100px;
      gap: 1em;
      padding: 0.8em 1.5em;
      font-size: calc(var(--fs-l) - 0.2rem);
      input {
        min-width: 80%;
        padding-bottom: 0.1em;
      }

      svg {
        width: 1.5rem;
      }
    }

    .cmid {
      margin: 1.5em 2em;
      .cmidHead {
        h2 {
          font-size: calc(var(--fs-m) + 0.2rem);
        }
      }

      .cmidList {
        display: flex;
        gap: 1em;
        margin-top: 2em;
        flex-wrap: wrap;
        .cmidCard {
          padding: 1em;
          min-width: 22rem;
          border-radius: 10px;
          .left {
            .upper {
              max-width: 20rem;
              img {
                width: 3.5em;
                height: 3.5em;
                margin-bottom: 1em;
              }

              h3 {
                font-size: calc(var(--fs-s) - 0.05rem);
              }

              p {
                font-size: calc(var(--fs-s) + 0.2rem);
              }
            }

            .down {
              margin-top: 1em;
              gap: 0.5em;
              p {
                font-weight: 700;
                font-size: calc(var(--fs-s) - 0.05rem);
              }

              svg {
                width: 0.8rem;
              }
            }
          }

          .right {
            svg {
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  @media (min-width: 36rem) and (max-width: 62.5rem) {
    .searchie {
      max-height: 100px;
      gap: 1em;
      padding: 0.8em 1.4em;
      font-size: calc(var(--fs-l) - 0.2rem);
      input {
        min-width: 80%;
        padding-bottom: 0.1em;
      }

      svg {
        width: 1.5rem;
      }
    }

    .cmid {
      margin: 1.5em 1.8em;
      .cmidHead {
        h2 {
          font-size: calc(var(--fs-m) + 0.1rem);
        }
      }

      .cmidList {
        display: flex;
        gap: 1em;
        margin-top: 1.8em;
        .cmidCard {
          padding: 1em;
          min-width: 20rem;
          border-radius: 10px;
          .left {
            .upper {
              max-width: 18rem;
              img {
                width: 3.8em;
                height: 3.8em;
                margin-bottom: 1em;
              }

              h3 {
                font-size: calc(var(--fs-s) - 0.1rem);
              }

              p {
                font-size: calc(var(--fs-s) + 0.12rem);
              }
            }

            .down {
              margin-top: 1em;
              gap: 0.5em;
              p {
                font-weight: 700;
                font-size: calc(var(--fs-s) - 0.1rem);
              }

              svg {
                width: 0.8rem;
              }
            }
          }

          .right {
            svg {
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  @media (max-width: 36rem) {
    .searchie {
      gap: 0.8em;
      padding: 1em 1.4em;
      font-size: calc(var(--fs-l) - 0.4rem);
      input {
        min-width: 75%;
        padding-bottom: 0.1em;
      }

      svg {
        width: 1.4rem;
      }
    }

    .cmid {
      margin: 1.4em;
      .cmidHead {
        h2 {
          font-size: var(--fs-m);
        }
      }

      .cmidList {
        display: flex;
        flex-direction: column;
        gap: 1em;
        margin-top: 1.5em;
        .cmidCard {
          padding: 1em;
          min-width: 100%;
          .left {
            .upper {
              max-width: 18rem;
              img {
                width: 4em;
                height: 4em;
                margin-bottom: 1em;
              }

              h3 {
                font-size: calc(var(--fs-s) - 0.05rem);
              }

              p {
                font-size: calc(var(--fs-s) + 0.2rem);
              }
            }

            .down {
              margin-top: 0.8em;
              gap: 0.5em;
              p {
                font-weight: 700;
                font-size: var(--fs-s);
              }

              svg {
                width: 0.8rem;
              }
            }
          }

          .right {
            svg {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
`;
