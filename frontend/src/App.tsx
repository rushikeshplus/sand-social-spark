import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";

type Post = {
  id: string;
  message: string;
  created_time: string;
  attachments?: {
    data?: {
      media_type?: string;
      media?: {
        image?: {
          src?: string;
        };
      };
    }[];
  };
};

type Comment = {
  id: string;
  message: string;
  from?: { id: string; name: string };
};

export default function App() {
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loadingComments, setLoadingComments] = useState<string | null>(null);

  // AI Reply state
  const [aiReply, setAiReply] = useState<Record<string, string>>({});
  const [loadingAi, setLoadingAi] = useState<string | null>(null);

  // Reply input state
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [postingReply, setPostingReply] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`/api/posts?platform=${selectedPlatform}`).then((res) => {
      if (Array.isArray(res.data)) setPosts(res.data);
      else setPosts([]);
    });
  }, [selectedPlatform]);

  const loadComments = async (postId: string) => {
    setLoadingComments(postId);
    try {
      const res = await axios.get(`/api/posts/${postId}/comments`);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error(err);
      setComments((prev) => ({ ...prev, [postId]: [] }));
    }
    setLoadingComments(null);
  };

  const handleSuggestReply = async (commentId: string, commentText: string) => {
    setLoadingAi(commentId);
    try {
      const res = await axios.post("/api/generate-reply", { text: commentText });
      setAiReply((prev) => ({ ...prev, [commentId]: res.data.reply }));
    } catch (err) {
      console.error(err);
      setAiReply((prev) => ({ ...prev, [commentId]: "AI error." }));
    }
    setLoadingAi(null);
  };

  const handlePostReply = async (commentId: string) => {
    setPostingReply(commentId);
    try {
      await axios.post(`/api/comments/${commentId}/reply`, {
        text: replyInput[commentId],
      });
      setReplyInput((prev) => ({ ...prev, [commentId]: "" }));
      alert("Reply posted!");
    } catch (err) {
      console.error(err);
      alert("Failed to post reply.");
    }
    setPostingReply(null);
  };

  return (
    <div className="app-container">
      <Sidebar selected={selectedPlatform} onSelect={setSelectedPlatform} />
      <main className="main">
        <div className="container">
          <h1>
            <span role="img" aria-label="fb">📘</span>
            {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} Page Monitor
          </h1>
          {posts.length === 0 && (
            <div className="post-card">Loading posts...</div>
          )}
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-content">
                <div className="post-message">{post.message || <i>No text</i>}</div>
                <div className="post-meta">
                  {new Date(post.created_time).toLocaleString()}
                </div>
                {post.attachments?.data?.[0]?.media?.image?.src && (
                  <img
                    src={post.attachments.data[0].media.image.src}
                    alt="Post"
                    className="post-image"
                  />
                )}
                <button
                  className="show-comments-btn"
                  onClick={() => loadComments(post.id)}
                  disabled={loadingComments === post.id}
                >
                  {loadingComments === post.id ? "Loading..." : "Show Comments"}
                </button>
              </div>
              <div className="comments-list">
                {(comments[post.id] || []).map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div>
                      <span className="comment-author">
                        {comment.from?.name || "Anonymous"}
                      </span>
                      <span style={{ marginLeft: 6, fontSize: 12, color: '#888ea8' }}>
                        {comment.id.slice(-4)}
                      </span>
                    </div>
                    <div>{comment.message}</div>
                    <div className="ai-reply-row">
                      <button
                        className="ai-reply-btn"
                        onClick={() => handleSuggestReply(comment.id, comment.message)}
                        disabled={loadingAi === comment.id}
                      >
                        {loadingAi === comment.id ? 'Thinking...' : 'Suggest AI Reply'}
                      </button>
                      {aiReply[comment.id] && (
                        <span className="ai-reply-text">💡 {aiReply[comment.id]}</span>
                      )}
                    </div>
                    <div className="reply-row">
                      <input
                        className="reply-input"
                        value={replyInput[comment.id] || ''}
                        onChange={(e) =>
                          setReplyInput((prev) => ({
                            ...prev,
                            [comment.id]: e.target.value,
                          }))
                        }
                        placeholder="Type your reply..."
                      />
                      <button
                        className="reply-btn"
                        onClick={() => handlePostReply(comment.id)}
                        disabled={
                          postingReply === comment.id ||
                          !(replyInput[comment.id] || '').trim()
                        }
                      >
                        {postingReply === comment.id ? 'Posting...' : 'Post Reply'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
