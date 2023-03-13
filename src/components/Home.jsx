import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Comments from "../utils/Comments";
import Likes from "../utils/Likes";
import Nav from "./Nav";

const Home = () => {
  const [thread, setThread] = useState("");
  const [threadList, setThreadList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      if (!localStorage.getItem("_id")) {
        navigate("/");
      } else {
        fetch("http://localhost:4000/api/all/thread")
          .then((res) => res.json())
          .then((data) => {
            setThreadList(data.threads)
          })
          .catch((err) => console.log(err));
      }
    };
    checkUser();
  }, [navigate]);

  const createThread = (e) => {
    fetch("http://localhost:4000/api/create/thread", {
      method: "POST",
      body: JSON.stringify({
        thread,
        userId: localStorage.getItem("_id"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setThreadList(data.threads);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createThread();
    setThread("");
  };
  return (
    <>
      <Nav />
      <main className="home">
        <h2 className="homeTitle">Create a Thread</h2>
        <form className="homeForm" onSubmit={handleSubmit}>
          <label htmlFor="reply">Title/Description</label>
          <div className="formContent">
            <textarea
              rows={5}
              value={thread}
              onChange={(e) => setThread(e.target.value)}
              type="text"
              name="reply"
              className="modalInput"
            />

            <button className="modalBtn">SEND</button>
          </div>
        </form>

        <div className="thread__container">
          {threadList.map((thread) => (
            <div className="thread__item" key={thread.id}>
              <p>{thread.title}</p>
              <div className="react__container">
                <Likes
                  numberOfLikes={thread.likes.length}
                  threadId={thread.id}
                />
                <Comments
                  numberOfComments={thread.replies.length}
                  threadId={thread.id}
                  title={thread.title}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
