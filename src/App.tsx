import { useState, useEffect } from 'react'
import axios from 'axios'

interface Post {
  id: string
  message: string
  created_time: string
}

interface Comment {
  id: string
  message: string
  created_time: string
  from: {
    name: string
    id: string
  }
}

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3001/api/posts')
      setPosts(response.data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (postId: string) => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:3001/api/posts/${postId}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReply = async (commentText: string) => {
    try {
      const response = await axios.post('http://localhost:3001/api/generate-reply', {
        text: commentText
      })
      setReplyText(response.data.reply)
    } catch (error) {
      console.error('Error generating reply:', error)
    }
  }

  const sendReply = async (commentId: string) => {
    try {
      await axios.post(`http://localhost:3001/api/comments/${commentId}/reply`, {
        text: replyText
      })
      alert('Reply sent successfully!')
      setReplyText('')
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Failed to send reply')
    }
  }

  const handlePostSelect = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Facebook Auto Reply Dashboard
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Posts Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Posts</h2>
            {loading && posts.length === 0 ? (
              <p className="text-gray-500">Loading posts...</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPost?.id === post.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePostSelect(post)}
                  >
                    <p className="text-gray-800 mb-2">{post.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_time).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Comments {selectedPost && `- ${selectedPost.message.substring(0, 50)}...`}
            </h2>
            {!selectedPost ? (
              <p className="text-gray-500">Select a post to view comments</p>
            ) : loading ? (
              <p className="text-gray-500">Loading comments...</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-2">
                      <p className="font-medium text-gray-800">{comment.from.name}</p>
                      <p className="text-gray-600">{comment.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(comment.created_time).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-3 space-y-2">
                      <button
                        onClick={() => generateReply(comment.message)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Generate AI Reply
                      </button>
                      {replyText && (
                        <div className="mt-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            rows={2}
                            placeholder="Edit the generated reply..."
                          />
                          <button
                            onClick={() => sendReply(comment.id)}
                            className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                          >
                            Send Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App