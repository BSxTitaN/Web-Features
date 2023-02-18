import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  orderBy,
  query,
  addDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../Firebase/main";
import { Info, Mail, MapPin, MinusCircle, Phone, Send, X } from "react-feather";
import { Tooltip } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";

export default function MuserInfo({ userID, userDatay }) {
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);
  const [noti, setNotice] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    if (!userID) return;

    const q3 = query(
      collection(db, "Backend-Users", userID, "Notice"),
      orderBy("date")
    );

    const subscriber3 = onSnapshot(q3, (querySnapshot) => {
      const getPostsFromFirebase = [];
      querySnapshot.forEach((doc) => {
        getPostsFromFirebase.push({
          ...doc.data(),
          key: doc.id,
        });
      });
      setPosts(getPostsFromFirebase);
      scrollToBottom();
    });

    const fetchUserData = async () => {
      const docRef = doc(db, "Backend-Users", userID);
      const docSnap = await getDoc(docRef);
      setUserData(docSnap.data());
    };

    fetchUserData();

    return () => {
      subscriber3();
    };
  }, [userID]);

  const onNotice = async (e) => {
    e.preventDefault();
    addDoc(collection(db, "Backend-Users", userID, "Notice"), {
      notice: noti.trim(),
      sender: userDatay.name,
      date: Timestamp.now(),
    });
    toast.success("Notice Sent Successfully!", {
      position: "bottom-left",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setNotice("");
  };

  return (
    <Uinfo>
      <ToastContainer />
      {userID != null && userID != "" ? (
        <div className="alluinfo">
          <div className="left">
            <div className="inHead" onClick={() => setOpenProfile(true)}>
              <div className="hLeft">
                <Image width={500} height={500} src={userData.photo} alt="" />
                <div className="info">
                  <h2>{userData.name}</h2>
                  <p>{userData.role}</p>
                </div>
              </div>

              <div className="hRight">
                {userData.online == true ? (
                  <div className="online">
                    <div className="spany" /> <p>Online</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="inBody">
              <div className="inBmess">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post.key}
                      className={`container ${
                        post.sender == userDatay.name ? "active" : ""
                      }`}
                    >
                      <div className="details">
                        <div className="messdet">
                          <p>{post.notice}</p>
                        </div>
                        {userDatay.role == "Director" ||
                        userDatay.role == "ERPAdmin" ? (
                          <Tooltip title="Delete">
                            <MinusCircle
                              onClick={() => {
                                deleteDoc(
                                  doc(
                                    db,
                                    "Backend-Users",
                                    userID,
                                    "Notice",
                                    post.key
                                  )
                                );
                                toast.error("Meesage Removed!", {
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
                          </Tooltip>
                        ) : null}
                      </div>

                      <div className="subdetails">
                        <h3>
                          {post.sender == userDatay.name ? "You" : post.sender}
                        </h3>
                        <p>{post.date.toDate().toDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Start sending message by typing and clicking submit</p>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="inBfield">
                <form className="innerBf" onSubmit={onNotice}>
                  <input
                    type="message"
                    placeholder="Type a message..."
                    name="notice"
                    autoComplete="off"
                    value={noti}
                    onChange={(e) => setNotice(e.target.value)}
                  />
                  <Tooltip title="Send Message">
                    <button type="submit" className="insend">
                      <Send />
                    </button>
                  </Tooltip>
                </form>
              </div>
            </div>
          </div>

          {openProfile && (
            <div className="right">
              <div className="rgtHead">
                <Tooltip title="Close">
                  <div className="cbtn" onClick={() => setOpenProfile(false)}>
                    <X />
                  </div>
                </Tooltip>

                <div className="rhProfo">
                  <Image width={500} height={500} src={userData.photo} alt="u_Image" />
                  <div className="info">
                    <h2>{userData.name}</h2>
                    <p>{userData.role}</p>
                  </div>
                </div>
              </div>

              <div className="rhpInfo">
                <div className="rhpTitle">
                  <h2>Other Info</h2>
                  <Info />
                </div>

                <div className="rhpDetails">
                  <div className="dt1">
                    <div className="iconChange">
                      <Mail />
                    </div>
                    <div className="detailChange">
                      <h5>Email:</h5>
                      <p>{userData.mail}</p>
                    </div>
                  </div>
                  <div className="dt1">
                    <div className="iconChange">
                      <Phone />
                    </div>
                    <div className="detailChange">
                      <h5>Phone:</h5>
                      <p>{userData.phone}</p>
                    </div>
                  </div>
                  <div className="dt1">
                    <div className="iconChange">
                      <MapPin />
                    </div>
                    <div className="detailChange">
                      <h5>Location:</h5>
                      <p>{userData.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="nodata">
          <Image width={500} height={500} className="nodimg" src="/notice/mail.png" alt="nodata" />
          <h1>Pick a user to start messaging!</h1>
        </div>
      )}
    </Uinfo>
  );
}

const Uinfo = styled.div`
  min-width: 75%;
  .nodata {
  }
  .nodimg {
    width: 20rem;
  }
  h1 {
    margin-top: -2rem;
    font-weight: 500;
    font-size: calc(var(--fs-l) - 0.2rem);
  }
  .alluinfo {
    display: flex;
    height: 100%;
    .left {
      width: ${(openProfile) => (!openProfile ? "60%" : "100%")};
      display: flex;
      flex-direction: column;
      .inHead {
        border-bottom: 1px solid #e8e9ec;
        padding: 1em 1.5em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .hLeft {
          display: flex;
          align-items: center;
          gap: 1em;
          img {
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
          }

          .info {
            h2 {
              font-size: calc(var(--fs-s) + 0.2rem);
              font-weight: 700;
            }

            p {
              font-weight: 400;
              font-size: var(--fs-s);
            }
          }
        }

        .hRight {
          display: flex;
          p {
            color: #23695e;
            font-weight: 500;
          }

          .online {
            display: flex;
            align-items: center;
            gap: 0.3em;
            .spany {
              background-color: #23695e;
              width: 0.8em;
              height: 0.8em;
              border-radius: 50%;
            }
          }
        }

        &:hover {
          background-color: #fafafa;
          cursor: pointer;
        }
      }

      .inBody {
        display: flex;
        gap: 1em;
        flex-direction: column;
        margin: 0em 1.5rem;
        height: 100%;
        overflow-y: hidden;
        .inBmess {
          overflow-y: auto;
          display: flex;
          height: 100%;
          margin-top: 1em;
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none;
          flex-direction: column;
          gap: 1em;
          .container {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            .details {
              display: flex;
              align-items: center;
              gap: 1em;

              svg {
                cursor: pointer;
                color: #a4a4a4;
                &:hover {
                  color: #e44235;
                }
              }

              .messdet {
                max-width: 50%;
                font-weight: 500;
                font-size: calc(var(--fs-s) + 0.2rem);
                color: #5e595e;
                word-wrap: break-word;
                background-color: #f7f9fd;
                border-radius: 20px 20px 20px 0px;
                padding: 1.5rem;
              }
            }

            .subdetails {
              display: flex;
              gap: 0.5em;
              align-items: center;
              h3 {
                font-weight: 700;
                font-size: calc(var(--fs-s) + 0.2rem);
              }

              p {
                font-weight: 500;
                font-size: var(--fs-s);
                color: #b1b1b1;
              }
            }

            &.active {
              .details {
                display: flex;
                align-items: center;
                flex-direction: row-reverse;
                .messdet {
                  font-size: calc(var(--fs-s) + 0.2rem);
                  color: #ffffff;
                  background-color: #23695e;
                  border-radius: 20px 20px 0px 20px;
                }
              }

              .subdetails {
                flex-direction: row-reverse;
              }
            }
          }

          &::-webkit-scrollbar {
            display: none; /* Safari and Chrome */
          }
        }

        .inBfield {
          border: 1px solid #e8e9ec;
          padding: 1em;
          position: sticky;
          position: -webkit-sticky;
          bottom: 1rem;
          border-radius: 10px;
          .innerBf {
            display: flex;
            justify-content: space-between;
            gap: 2em;
            input {
              width: 100%;
              background: none;
              transform: translate(0);
              transition: 0.5s ease-in;
              font-weight: 500;
              font-size: var(--fs-m);
              border-bottom: 1px solid #ffffff;
              &:focus {
                outline: none;
                border-bottom: 1px solid #e6f5fa;
              }
            }

            .insend {
              background-color: #23695e;
              padding: 1em;
              border-radius: 50%;
              cursor: pointer;
              svg {
                color: #ffffff;
                width: 1.5rem;
              }
            }
          }
        }
      }
    }

    .right {
      width: 40%;
      border-left: 1px solid #e8e9ec;
      transition: width 0.5s ease-in;
      -ms-overflow-style: none; /* Internet Explorer 10+ */
      scrollbar-width: none;
      height: 100%;
      overflow-y: auto;
      .rgtHead {
        gap: 2em;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        width: 100%;
        border-bottom: 1px solid #e8e9ec;
        .cbtn {
          border: 1px solid #e8e9ec;
          border-radius: 50%;
          width: fit-content;
          padding: 0.5em;
          cursor: pointer;
        }

        .rhProfo {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1em;
          img {
            border-radius: 50%;
            width: 10rem;
            height: 10rem;
            padding: 0.5em;
            border: 1px solid #e8e9ec;
          }
          .info {
            text-align: center;
            h2 {
              font-size: calc(var(--fs-m) + 0.2rem);
              font-weight: 900;
              color: #111111;
            }

            p {
              font-weight: 500;
              font-size: calc(var(--fs-s) + 0.2rem);
              color: #b1b1b1;
            }
          }
        }
      }

      .rhpInfo {
        display: flex;
        flex-direction: column;
        padding: 1.5em;
        gap: 2rem;
        .rhpTitle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          h2 {
            font-weight: 700;
            font-size: calc(var(--fs-m) + 0.2rem);
          }

          svg {
            color: #b1b1b1;
            width: 1.5rem;
          }
        }

        .rhpDetails {
          display: flex;
          gap: 1em;
          flex-direction: column;
          .dt1 {
            display: flex;
            gap: 1em;
            align-items: center;
            .detailChange {
              h5 {
                margin-bottom: 0.2em;
                font-weight: 700;
                color: #b1b1b1;
                font-size: calc(var(--fs-s) - 0.1rem);
              }
              p {
                font-weight: 500;
                font-size: var(--fs-s);
                color: #111111;
              }
            }

            .iconChange {
              border: 1px solid #e8e9ec;
              border-radius: 50%;
              padding: 0.8em;
              width: fit-content;
              svg {
                color: #b1b1b1;
                width: 1.5rem;
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
    .nodimg {
      width: 20rem;
    }

    h1 {
      margin-top: -2rem;
      font-size: calc(var(--fs-m) + 0.2rem);
    }

    .alluinfo {
      height: 100%;
      .left {
        width: ${(openProfile) => (!openProfile ? "50%" : "100%")};
        .inHead {
          padding: 0.8em 1.4em;
          .hLeft {
            gap: 0.8em;
            img {
              width: 2.2rem;
              height: 2.2rem;
            }

            .info {
              h2 {
                font-size: calc(var(--fs-s) + 0.1rem);
              }

              p {
                font-size: var(--fs-s);
              }
            }
          }

          .hRight {

            p {
              color: #23695e;
              font-weight: 500;
              font-size: var(--fs-s);
            }

            .online {
              gap: 0.3em;
              .spany {
                width: 0.8rem;
                height: 0.8rem;
              }
            }
          }
        }

        .inBody {
          gap: 2em;
          .inBmess {
            gap: 2em;
            .container {
              .details {
                gap: 1em;
                svg {
                }

                .messdet {
                  max-width: 60%;
                  font-size: calc(var(--fs-s) + 0.2rem);
                  padding: 1.2rem;
                  font-weight: 450;
                }
              }

              .subdetails {
                gap: 0.5em;
                h3 {
                  font-size: calc(var(--fs-s) + 0.1rem);
                }

                p {
                  font-size: var(--fs-s);
                }
              }
            }
          }

          .inBfield {
            padding: 1em;
            .innerBf {
              display: flex;
              justify-content: space-between;
              gap: 1.5em;
              input {
                font-size: calc(var(--fs-s) + 0.2rem);
              }

              .insend {
                padding: 1em;
                svg {
                  width: 1.3rem;
                }
              }
            }
          }
        }
      }

      .right {
        width: 50%;
        .rgtHead {
          gap: 2em;
          padding: 1.2rem;
          .cbtn {
            width: fit-content;
            padding: 0.3em 0.5em;
            svg {
              width: 1rem;
            }
          }

          .rhProfo {
            gap: 1em;
            img {
              width: 7rem;
              height: 7rem;
              padding: 0.5em;
            }
            .info {
              h2 {
                font-size: calc(var(--fs-s) + 0.2rem);
              }

              p {
                font-size: calc(var(--fs-s) + 0.1rem);
              }
            }
          }
        }

        .rhpInfo {
          padding: 1.2em;
          gap: 2rem;
          .rhpTitle {
            h2 {
              font-size: calc(var(--fs-s) + 0.2rem);
            }

            svg {
              width: 1.3rem;
            }
          }

          .rhpDetails {
            gap: 1em;
            .dt1 {
              gap: 1em;
              .detailChange {
                width: 60%;
                word-wrap: break-word;
                h5 {
                  margin-bottom: 0.1em;
                  font-size: calc(var(--fs-s) - 0.1rem);
                }
                p {
                  font-size: var(--fs-s);
                }
              }

              .iconChange {
                padding: 0.7em 0.8rem;
                width: fit-content;
                svg {
                  color: #b1b1b1;
                  width: 1.2rem;
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
