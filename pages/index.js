import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import Posts from '../components/Posts'
import styles from '../styles/Home.module.css'

class Home extends React.Component {
  static async getInitialProps(ctx) {
    const res = await fetch('https://kabulnow.af/wp-json/wp/v2/posts')
    return {
      posts: res.data
    }
  }
  render() {
    return (
            
      <>
      
         <div>
             <h1>All Posts</h1>
             <h6>
                 {
                    this.props.posts.map(post => {
                      return (
                        <div key={post.id}>{post.title.rendered}</div>
                      );
                    })
                 }
             </h6>
         </div>
      </>
  );
  } 
}
export default Home;

