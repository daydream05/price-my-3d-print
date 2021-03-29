import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react"

import mousetrap from "mousetrap"
import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi'
import { Canvas } from 'react-three-fiber'
import { Model3D } from './model-3D.'

export const ModelViewer = ({ isOpen, onClose, models, startingModelIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // set currentIndex based on startingModelIndex
  useEffect(() => {
    setCurrentIndex(startingModelIndex)
  }, [startingModelIndex])

  const model = models ? models[currentIndex] : null

  useEffect(() => {
    mousetrap.bind(`right`, next)
    mousetrap.bind(`left`, previous)
    mousetrap.bind(`escape`, dismiss)

    return () => {
      mousetrap.unbind(`left`)
      mousetrap.unbind(`right`)
      mousetrap.unbind(`escape`)
    }
  }, [`left`, `right`, `space`, `escape`, currentIndex])
  

  const next = e => {
    if (e) {
      e.stopPropagation()
    }

    if (currentIndex + 1 === models?.length) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(previous => previous + 1)
    }
  }

  const previous = e => {
    if (e) {
      e.stopPropagation()
    }

    if (currentIndex === 0) {
      setCurrentIndex(models?.length - 1)
    } else {
      setCurrentIndex(previous => previous - 1)
    }
  }

  const dismiss = () => {
    onClose()
  }

  console.log(model)


  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          sx={{
            position: `relative`,
            maxWidth: `xl`,
            height: `600px`,
            mt: `auto`,
            mb: `auto`,
          }}
        >
          <Flex
            flexDirection="column"
            sx={{ position: `relative`, zIndex: 1, height: `100%` }}
          >
            <ModalHeader>
              {model && (
                <Stack>
                  <Text>{model.name}</Text>
                </Stack>
              )}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {model && (
                <Canvas>
                  {model?.bufferGeometry && (
                    <Model3D geometry={model.bufferGeometry} />
                  )}
                </Canvas>
              )}
            </ModalBody>
            <Flex
              justifyContent="center"
              alignItems="center"
              height="100%"
              width="100%"
              sx={{ position: `absolute`, top: 0, left: 0, zIndex: -1 }}
            >
              <IconButton
                aria-label="next"
                onClick={next}
                icon={<HiArrowNarrowRight />}
                sx={{
                  position: `absolute`,
                  right: 0,
                  transform: `translateX(calc(100% + 16px))`,
                }}
              />
              <IconButton
                aria-label="previous"
                onClick={previous}
                icon={<HiArrowNarrowLeft />}
                sx={{
                  position: `absolute`,
                  left: 0,
                  transform: `translateX(calc(-100% - 16px))`,
                }}
              />
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  )
}