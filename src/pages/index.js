import * as React from "react"
import { GatsbySeo } from 'gatsby-plugin-next-seo';

import Layout from "../components/layout"
import { Calculator } from "../components/calculator"

const IndexPage = () => (
  <Layout>
    <GatsbySeo
      title="3D Printing Price Calculator | PriceMy3DPrint"
      description="Calculate how much you should price your 3D prints right on your browser! Just drop your .STL files and you'll see it instantly."
    />
    <Calculator />
  </Layout>
)

export default IndexPage
