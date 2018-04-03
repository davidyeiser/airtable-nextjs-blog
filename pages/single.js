import fetch from 'isomorphic-unfetch'

import Layout from '../components/Layout'
import Post from '../components/Post'

class Single extends React.Component {
  constructor() {
    super()

    this.state = {
      airtablePost: {}
    }
  }

  componentDidMount() {
    const {
      title,
      content,
      publish_date
    } = this.props

    this.setState({
      airtablePost: {
        title,
        content,
        publish_date
      }
    })
  }

  render() {
    const {
      title,
      content,
      publish_date
    } = this.state.airtablePost

    return (
      <Layout>
        <Post
          title={title}
          content={content}
          publish_date={publish_date}
        />
      </Layout>
    )
  }
}

Single.getInitialProps = async (context) => {
  const basePath = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000' : 'https://yourdomain.com'
  const { id } = context.query

  const res = await fetch(`${basePath}/api/post/${id}`)
  const airtablePost = await res.json()

  return airtablePost ? airtablePost.data : {}
}

export default Single
