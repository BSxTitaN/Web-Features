import Image from "next/image";
import { useState, useEffect } from "react";
import styled from "styled-components";
import TopBar from "../topBar";
import MuserInfo from "./userinfo";
import { db } from "../../../Firebase/main";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import { ChevronRight, Search, X } from "react-feather";
import FooterMain from "../footerMain";

export default function NotiIn({ userData }) {
  const [posts, setPosts] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const q = query(collection(db, "Backend-Users"), orderBy("joined", "desc"));
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
          <Image width={500} height={500} className="nodimg" src="/notice/nodata2.png" alt="nodata" />
          <h1>No Staff Exists!</h1>
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
    <NotiIndex className="SecContainer">
      <TopBar pageName={"Inter-Message"} />

      <div className="conlist">
        <div className="duserlist">
          <div className="up">
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
          <div className="down">
            {searchInput.length > 1 ? (
              filteredResults.map((post) => (
                <div
                  className={`staffCard ${
                    activeId === post.key ? "active" : ""
                  }`}
                  key={post.key}
                  onClick={() => setActiveId(post.key)}
                >
                  <div className="usBody">
                    <Image width={500} height={500} src={post.photo} alt="" />
                    <div className="info">
                      <h2>{post.name}</h2>
                      <p>{post.role}</p>
                    </div>
                  </div>
                  <ChevronRight />
                </div>
              ))
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div
                  className={`staffCard ${
                    activeId === post.key ? "active" : ""
                  }`}
                  key={post.key}
                  onClick={() => setActiveId(post.key)}
                >
                  <div className="usBody">
                    <Image width={500} height={500} src={post.photo} alt="" />
                    <div className="info">
                      <h2>{post.name}</h2>
                      <p>{post.role}</p>
                    </div>
                  </div>
                  <ChevronRight />
                </div>
              ))
            ) : (
              <div className="nodata">
                <Image width={500} height={500} className="nodimg" src="/notice/nodata.png" alt="nodata" />
                <h1>Error fetching staff data!</h1>
              </div>
            )}
          </div>
        </div>

        <MuserInfo userID={activeId} userDatay={userData} />
      </div>

      <FooterMain />
    </NotiIndex>
  );
}

const NotiIndex = styled.div`
  .nodata {
    
  }
  .nodimg {
    width: 13rem;
  }
  h1 {
    font-size: calc(var(--fs-l) - 0.2rem);
  }

  height: 100%;

  .conlist {
    height: calc(100vh - 100px);
    display: flex;
    .duserlist {
      min-width: 25%;
      border-right: 1px solid #e8e9ec;
      display: flex;
      overflow: auto;
      -ms-overflow-style: none; /* Internet Explorer 10+ */
      scrollbar-width: none; /* Firefox */
      flex-direction: column;
      .up {
        display: flex;
        flex-direction: row;
        padding: 1.72em;
        align-items: center;
        gap: 1em;
        border-bottom: 1px solid #e8e9ec;

        svg {
          width: 1.35rem;
        }
        input {
          max-width: 70%;
          width: 100%;
          background: none;
          transform: translate(0);
          transition: 0.5s ease-in;
          border-bottom: 1px solid #ffffff;
          &:focus {
            outline: none;
            border-bottom: 1px solid #e6f5fa;
          }
        }
      }

      .down {
        display: flex;
        flex-direction: column;
        .staffCard {
          display: flex;
          justify-content: space-between;
          gap: 1em;
          padding: 1em 1.2em;
          transition: all 0.2s;
          align-items: center;
          .usBody {
            display: flex;
            align-items: center;
            gap: 1em;
            img {
              border-radius: 50%;
              width: 3.5rem;
              height: 3.5rem;
            }

            .info {
              h2 {
                font-weight: 600;
                font-size: var(--fs-m);
              }

              p {
                font-weight: 400;
                color: #9fa5ac;
                font-size: var(--fs-s);
              }
            }
          }
          &:hover {
            background-color: #fafafa;
            cursor: pointer;
          }

          &.active {
            background-color: #e6f5f3;
            .info {
              h2 {
                color: #336459;
              }

              p {
                color: #7aa59d;
              }
            }
          }
        }
      }

      &::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
      }
    }
  }

  @media (min-width: 62.5rem) and (max-width: 89rem) {
    .conlist {
      .duserlist {
        min-width: 25%;
        overflow: auto;
        .up {
          padding: 1.33em 1.2rem;
          gap: 1em;

          svg {
            width: 1.15rem;
          }
          input {
            font-size: var(--fs-s);
            max-width: 60%;
          }
        }

        .down {
          .staffCard {
            padding: 1em 1.2em;
            .usBody {
              gap: 0.8em;
              img {
                border-radius: 50%;
                width: 2.5rem;
                height: 2.5rem;
              }

              .info {
                h2 {
                  font-size: calc(var(--fs-m) - 0.3rem);
                }

                p {
                  font-size: var(--fs-s);
                }
              }
            }
          }
        }
      }
    }
  }

  @media (min-width: 36rem) and (max-width: 62.5rem) {
  }

  @media (max-width: 36rem) {
  }
`;
