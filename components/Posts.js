import axios from 'axios';
import React from 'react';

export default class Posts extends React.Component {
    static async getInitialProps() {

        // Make request for posts.
        const response = await axios.get( 'http://kabulnow.af/wp-json/wp/v2/posts' )
        console.log(response);
        // Return response to posts object in props.
        return {
          posts: response.data
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
                                   <li key={post.id}>{post.title.rendered}</li>
                               );
                           })
                       }
                   </h6>
               </div>
            </>
        );
      }
     
}