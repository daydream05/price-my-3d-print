import React, { useCallback, useState, useEffect } from "react"
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { STLLoader } from 'three-stdlib/loaders/STLLoader'
import { useDropzone } from "react-dropzone"

/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Text } from "@chakra-ui/react"
import { Box, Flex } from "@chakra-ui/layout"

import { getVolume } from "../utils/getVolume"
import { getModelDimensions } from "../utils/getModelDimensions"


const DropZone = props => {
  const { getModelInformation, getIsFileRejected } = props

  const [isFileRejected, setFileRejected] = useState(false)

  useEffect(() => {
    getIsFileRejected && getIsFileRejected(isFileRejected)
  }, [isFileRejected])

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file, id) => {
      const reader = new FileReader()
      // We limit to 100 Mb
      const maxFileSize = 1000 * 1000 * 150

      if (file.size > maxFileSize) {
        reader.abort()
        setFileRejected(true)
      } else {
        setFileRejected(false)
        reader.readAsArrayBuffer(file)
      }

      reader.onabort = () => console.log("file reading was aborted")
      reader.onerror = () => console.log("file reading has failed")
      reader.onload = () => {
        const result = reader.result

        const fileExtension = file.name.split(".").slice(-1)[0].toLowerCase()

        if (fileExtension === "stl") {
          const geometry = new STLLoader().parse(result)

          geometry.center()
          const dimensions = getModelDimensions(geometry)
          const volume = getVolume(geometry)

          getModelInformation({
            dimensions,
            volume,
            fileName: file.name,
            fileSize: file.size,
            fileExtension,
            geometry: geometry,
            fileBlob: result,
          })
        } else if (fileExtension === "obj") {
          console.log(result)
          const object3D = new OBJLoader2().parse(result)
          const geometry = object3D.children[0].geometry

          geometry.center()
          const dimensions = getModelDimensions(geometry)
          const volume = getVolume(geometry)

          getModelInformation({
            dimensions,
            volume,
            fileName: file.name,
            fileSize: file.size,
            fileExtension,
            geometry: geometry,
            fileBlob: result,
          })
        }
      }
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  return (
    <>
      <Box
        sx={{
          px: 5,
          py: 4,
          border: `2px dashed`,
          borderColor: `darkGray`,
          borderRadius: `8px`,
          backgroundColor: `gray.50`,
          cursor: `pointer`,
          height: `200px`,
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} accept=".stl, .obj" />
        <Flex
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
          alignItems="center"
          height="100%"
        >
          <Text fontSize="sm">Drop your file or click here</Text>
          <Text fontSize="xs">
            We only accept .STL and .OBJ files under 150Mb
          </Text>
        </Flex>
      </Box>
    </>
  )
}

export default DropZone