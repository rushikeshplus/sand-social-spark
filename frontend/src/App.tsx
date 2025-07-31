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

          </h1>
          <p className="text-blue-200 text-center text-lg mb-8">Social Feed</p>
          {posts.length === 0 && (
            <div className="post-card">Loading posts...</div>
          )}
          {posts.map((post) => (

          ))}
        </div>
      </main>
    </div>
  );
}
