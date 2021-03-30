/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import { Box, Container, Text } from "@chakra-ui/layout"
import { MailinglistForm } from "./mailinglist-form"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={"Price my 3D Print"} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 1200,
          padding: `0 1.0875rem 1.45rem`,
          minHeight: `calc(100vh - 64px - 130px)`,
          paddingTop: `32px`,
          paddingBottom: `64px`,
        }}
      >
        <Box as="main">
          {children}
        </Box>
      </div>
      <footer>
        <Box sx={{ py: `64px`, px: 4, bg: `gray.900` }}>
          <Container>
            <Box>
              <Text fontSize="xs" mb={2} color="white">
                Product updates right to your mailbox. No spam attached.
              </Text>
              <MailinglistForm />
            </Box>
          </Container>
        </Box>
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
