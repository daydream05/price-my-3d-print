import * as React from "react"
import { GatsbySeo } from 'gatsby-plugin-next-seo';

import Layout from "../components/layout"
import { Calculator } from "../components/calculator"

const IndexPage = () => (
  <Layout>
    <GatsbySeo
      title="3D Printing Price Calculator | PriceMy3DPrint"
    />
    <Calculator />
  </Layout>
)

export default IndexPage
