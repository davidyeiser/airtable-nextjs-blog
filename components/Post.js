import Link from 'next/link'
import dateFormat from 'dateformat'
import Markdown from 'react-markdown'

class Post extends React.Component {
  render() {
    const {
      title,
      content,
      publish_date,
      slug,
      id
    } = this.props

    const permalink = !!id ? '/post/' + id + '/' + slug : false

    return (
      <div>
        {!!permalink ?
          <Link href={permalink}>
            <a title="Permalink for this note">
              {title && <h2>{title}</h2>}
              {publish_date &&
                <time dateTime={dateFormat(publish_date, 'isoDateTime')}>{dateFormat(publish_date, 'mmmm d, yyyy')}</time>
              }
            </a>
          </Link> :
          <div>
            {title && <h1>{title}</h1>}
            {publish_date &&
              <time dateTime={dateFormat(publish_date, 'isoDateTime')}>{dateFormat(publish_date, 'mmmm d, yyyy')}</time>
            }
          </div>
        }

        {content && <Markdown source={content} /> }
      </div>
    )
  }
}

export default Post
