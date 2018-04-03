import fetch from 'isomorphic-unfetch'
import Link from 'next/link'
import shortid from 'shortid'

import Layout from '../components/Layout'
import Post from '../components/Post'

class Home extends React.Component {
  constructor() {
    super()

    this.state = {
      airtablePosts: []
    }
  }

  componentDidMount() {
    const { props } = this

    const transferPosts = new Promise((resolve) => {
      const collectPosts = []

      Object.keys(props).map((item) => {
        // Filter out other props like 'url', etc.
        if (typeof props[item].id !== 'undefined') {
          collectPosts.push(props[item])
        }
      })

      resolve(collectPosts)
    })

    Promise.resolve(transferPosts).then(data => {
      this.setState({ airtablePosts: data })
    })
  }

  render() {
    const { airtablePosts } = this.state

    if (!Array.isArray(airtablePosts) || !airtablePosts.length) {
      // Still loading Airtable data
      return (
        <Layout>
          <p>Loading&hellip;</p>
        </Layout>
      )
    }
    else {
      // Loaded
      return (
        <Layout>
          {airtablePosts.map((post) =>
            <Post
              key={shortid.generate()}
              title={post.title}
              content={post.content}
              publish_date={post.publish_date}
              slug={post.slug}
              id={post.id}
            />
          )}
        </Layout>
      )
    }
  }
}

Home.getInitialProps = async (context) => {
  const basePath = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000' : 'https://yourdomain.com'

  const res = await fetch(`${basePath}/api/get/posts`)
  const airtablePosts = await res.json()

  return airtablePosts ? airtablePosts.data : {}
}

export default Home
