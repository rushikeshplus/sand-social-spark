import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { User } from "lucide-react";

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
    } catch (e) {
      setComments((prev) => ({ ...prev, [postId]: [] }));
    }
    setLoadingComments(null);
  };

  const handleSuggestReply = async (commentId: string, commentText: string) => {
    setLoadingAi(commentId);
    try {
      const res = await axios.post("/api/generate-reply", { text: commentText });
      setAiReply((prev) => ({ ...prev, [commentId]: res.data.reply }));
    } catch (e) {
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
    } catch (e) {
      alert("Failed to post reply.");
    }
    setPostingReply(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-background">
      <Sidebar selected={selectedPlatform} onSelect={setSelectedPlatform} />
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-1">
            {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
          </h1>
          <p className="text-blue-200 text-center text-lg mb-8">Social Feed</p>
          {posts.length === 0 && (
            <Card className="bg-gradient-card glass-card shadow-card mb-8">
              <CardContent className="p-8 text-center text-muted-foreground">
                Loading posts...
              </CardContent>
            </Card>
          )}
          {posts.map((post) => (
            <Card
              key={post.id}
              className="mb-10 bg-gradient-card glass-card shadow-card transition-smooth hover:shadow-elegant"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <User className="w-10 h-10 text-blue-300 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-white mb-1">
                      {post.message || <i>No text</i>}
                    </p>
                    <div className="text-xs text-blue-200 mb-2">
                      Anonymous • {new Date(post.created_time).toLocaleString()}
                    </div>
                    {post.attachments?.data?.[0]?.media?.image?.src && (
                      <img
                        src={post.attachments.data[0].media.image.src}
                        alt="Post"
                        className="rounded-lg shadow-card my-3 max-w-full"
                        style={{ maxWidth: 350 }}
                      />
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      className="mt-2 w-fit bg-gradient-primary shadow-elegant"
                      onClick={() => loadComments(post.id)}
                      disabled={loadingComments === post.id}
                    >
                      {loadingComments === post.id ? "Loading..." : "Show Comments"}
                    </Button>
                  </div>
                </div>
                <div className="mt-5 space-y-5">
                  {(comments[post.id] || []).map((comment) => (
                    <Card
                      key={comment.id}
                      className="glass-card bg-gradient-card shadow-card border-primary/40"
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <User className="w-8 h-8 text-blue-300 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-bold text-white mb-1">
                              {comment.message}
                            </div>
                            <div className="text-xs text-blue-200 mb-2">
                              {comment.from?.name || "Anonymous"} • {comment.id.slice(-4)}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="transition-smooth"
                                onClick={() =>
                                  handleSuggestReply(comment.id, comment.message)
                                }
                                disabled={loadingAi === comment.id}
                              >
                                {loadingAi === comment.id
                                  ? "Thinking..."
                                  : "Suggest AI Reply"}
                              </Button>
                              {aiReply[comment.id] && (
                                <span className="ml-2 text-primary text-sm italic">
                                  💡 {aiReply[comment.id]}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <input
                                className="flex-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white placeholder-blue-100 outline-none"
                                value={replyInput[comment.id] || ""}
                                onChange={(e) =>
                                  setReplyInput((prev) => ({
                                    ...prev,
                                    [comment.id]: e.target.value,
                                  }))
                                }
                                placeholder="Type your reply..."
                              />
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handlePostReply(comment.id)}
                                disabled={
                                  postingReply === comment.id ||
                                  !(replyInput[comment.id] || "").trim()
                                }
                                className="rounded-full bg-blue-600/80 px-4 py-1 shadow-elegant"
                              >
                                {postingReply === comment.id
                                  ? "Posting..."
                                  : "Post Reply"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
