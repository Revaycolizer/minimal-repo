
import { getPosts } from "@/app/actions/getPosts";
import styles from "@/app/page.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Posts from "./Post";


export default async function AddedPost() {
    const posts = await getPosts()
    // const [posts, setPosts] = useState<any[] | null>(null);
    // const [loading, setLoading] = useState(true);
  
    // useEffect(() => {
    //   async function fetchPosts() {
    //     try {
    //       const response = await axios.get("/api/posts"); // Use the relative path to your API route
    //       setPosts(response.data);
    //     } catch (error) {
    //       console.error("Failed to fetch posts:", error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   }
  
    //   fetchPosts();
    // }, []);
  
    return (
      <div className={styles.main}>
        <div>
          {/* {loading ? (
            <p>Fetching Posts...</p>
          ) : posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <div key={post.id} className={styles.post}>
                <video src={post.src} className={styles.postImage} controls />
                <p>Name: {post.name}</p>
                
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )} */}
          {posts && posts.map((post:any)=>(<Posts key={post.name} post={post}/>))}
        </div>
      </div>
    );
}
