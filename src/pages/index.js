import * as React from "react"
import { GatsbySeo } from 'gatsby-plugin-next-seo';

import Layout from "../components/layout"
import { Calculator } from "../components/calculator"

import ogImg from '../images/og-image.png'

const IndexPage = () => {
  console.log(ogImg)
  return (
    <Layout>
      <GatsbySeo
        title="3D Printing Price Calculator | PriceMy3DPrint"
        description="Calculate how much you should price your 3D prints right on your browser! Just drop your .STL files and see them instantly."
        openGraph={{
          images: [{ url: `https://pricemy3dprint.com/${ogImg}` }],
        }}
      />
      <Calculator />
    </Layout>
  )
}

export default IndexPage
