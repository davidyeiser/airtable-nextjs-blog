import React from 'react'
import Head from 'next/head'
import styled from 'styled-components'

const Site = styled.div`
  max-width: 600px;
  margin: 100px auto;
  background-color: #fff;
`

export default class Layout extends React.Component {
  render () {
    const { children } = this.props
    const title = 'My site'

    return (
      <Site>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />

          <title>{title}</title>
        </Head>

        {children}
      </Site>
    )
  }
}
