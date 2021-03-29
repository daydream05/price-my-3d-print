import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { Box, Text } from "@chakra-ui/layout"

const Header = ({ siteTitle }) => (
  <Box as="header" shadow="sm" borderBottomWidth="2px">
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <div style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            textDecoration: `none`,
          }}
        >
          <Text as="span" fontWeight="bold">{siteTitle}</Text>
        </Link>
      </div>
    </div>
  </Box>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
