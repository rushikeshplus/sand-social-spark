import { useState, useEffect } from 'react'
import { MessageSquare, Users, Bot, Send, RefreshCw, Clock } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface Post {
  id: string
  message: string
  created_time: string
  author_name?: string
  engagement_count?: number
}

interface Comment {
  id: string
  message: string
  created_time: string
  from: {
    name: string
    id: string
  }
  replied?: boolean
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
      // Demo posts for now - you can connect to Facebook API later
      const demoPosts: Post[] = [
        {
          id: '1',
          message: 'Just launched our new product! Check it out and let us know what you think. We\'ve been working on this for months and are excited to share it with you all.',
          created_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          author_name: 'Your Business Page',
          engagement_count: 15
        },
        {
          id: '2', 
          message: 'Weekly update: This week we\'ve been focusing on customer feedback and making improvements to our service.',
          created_time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          author_name: 'Your Business Page',
          engagement_count: 8
        },
        {
          id: '3',
          message: 'Thanks everyone for the amazing support! We hit 1000 followers today 🎉',
          created_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          author_name: 'Your Business Page', 
          engagement_count: 42
        }
      ]
      setPosts(demoPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (postId: string) => {
    try {
      setLoading(true)
      // Demo comments based on post
      const demoComments: Comment[] = [
        {
          id: `${postId}-1`,
          message: 'This looks amazing! When will it be available?',
          created_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          from: { name: 'Sarah Johnson', id: 'user1' },
          replied: false
        },
        {
          id: `${postId}-2`, 
          message: 'Great work team! Can\'t wait to try this out.',
          created_time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          from: { name: 'Mike Chen', id: 'user2' },
          replied: postId === '1'
        },
        {
          id: `${postId}-3`,
          message: 'Do you have pricing information available?',
          created_time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          from: { name: 'Emma Davis', id: 'user3' },
          replied: false
        }
      ]
      setComments(demoComments)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReply = async (commentText: string) => {
    try {
      // AI-powered reply generation (demo)
      const replies = [
        'Thank you for your interest! We\'ll be sharing more details soon. Stay tuned!',
        'We appreciate your feedback! Feel free to reach out if you have any questions.',
        'Thanks for the support! We\'re excited to have you as part of our community.',
        'Great question! Let me get back to you with more specific information.',
        'We\'re thrilled you\'re interested! More updates coming your way soon.'
      ]
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)]
      setReplyText(randomReply)
    } catch (error) {
      console.error('Error generating reply:', error)
    }
  }

  const sendReply = async (commentId: string) => {
    try {
      // Mark comment as replied
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replied: true }
          : comment
      ))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Social AI Assistant
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Intelligent auto-reply system for your social media engagement
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                <p className="text-sm text-muted-foreground">Active Posts</p>
              </div>
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{comments.length}</p>
                <p className="text-sm text-muted-foreground">Comments Today</p>
              </div>
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {comments.filter(c => c.replied).length}
                </p>
                <p className="text-sm text-muted-foreground">AI Replies Sent</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Posts Section */}
          <div className="bg-card/80 backdrop-blur-sm border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Recent Posts</h2>
              <button
                onClick={fetchPosts}
                className="ml-auto p-2 hover:bg-muted rounded-lg transition-colors"
                title="Refresh posts"
              >
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            
            {loading && posts.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPost?.id === post.id 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handlePostSelect(post)}
                  >
                    <p className="text-foreground mb-3 line-clamp-3">{post.message}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(post.created_time).toLocaleString()}
                      </div>
                      {post.engagement_count && (
                        <div className="flex items-center gap-1 text-primary">
                          <Users className="h-3 w-3" />
                          <span className="font-medium">{post.engagement_count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-card/80 backdrop-blur-sm border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-semibold text-foreground">
                Comments & Replies
                {selectedPost && (
                  <span className="text-sm text-muted-foreground font-normal ml-2">
                    • {selectedPost.message.substring(0, 30)}...
                  </span>
                )}
              </h2>
            </div>
            
            {!selectedPost ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Select a post to view comments</p>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading comments...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-medium">
                          {comment.from.name.charAt(0)}
                        </div>
                        <p className="font-medium text-foreground">{comment.from.name}</p>
                        {comment.replied && (
                          <span className="ml-auto bg-accent/20 text-accent text-xs px-2 py-1 rounded-full">
                            Replied
                          </span>
                        )}
                      </div>
                      <p className="text-foreground/90 mb-2">{comment.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(comment.created_time).toLocaleString()}
                      </div>
                    </div>
                    
                    {!comment.replied && (
                      <div className="space-y-3">
                        <button
                          onClick={() => generateReply(comment.message)}
                          disabled={loading}
                          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          <Bot className="h-4 w-4" />
                          Generate AI Reply
                        </button>
                        
                        {replyText && (
                          <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                            <label className="text-sm font-medium text-foreground">
                              AI Generated Reply:
                            </label>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="w-full p-3 border border-border rounded-lg bg-background text-foreground text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              rows={3}
                              placeholder="Edit the generated reply..."
                            />
                            <button
                              onClick={() => sendReply(comment.id)}
                              className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm hover:bg-accent/90 transition-colors"
                            >
                              <Send className="h-4 w-4" />
                              Send Reply
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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