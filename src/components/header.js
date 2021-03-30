import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { Box, Container, Flex, Text } from "@chakra-ui/layout"
import { FeedbackFish } from "@feedback-fish/react"
import { Button } from "@chakra-ui/button"

import logo from '../images/logo.svg'

const Header = ({ siteTitle }) => (
  <Box as="header" shadow="sm" borderBottomWidth="2px">
    <Container
      sx={{
        maxWidth: 1000,
        px: 4,
        py: 4,
        display: `flex`,
        justifyContent: `center`,
        width: `100%`,
      }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: `100%` }}
      >
        <div style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              textDecoration: `none`,
              display: `flex`,
              alignItems: `center`
            }}
          >
            <img src={logo} alt="logo" width="32px" height="32px" style={{ marginRight: `8px` }} />
            <Text as="span" fontWeight="bold">
              {siteTitle}
            </Text>
          </Link>
        </div>
        <FeedbackFish projectId="fe288f8d4c1fdc">
          <Button colorScheme="yellow">Send feedback</Button>
        </FeedbackFish>
      </Flex>
    </Container>
  </Box>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
