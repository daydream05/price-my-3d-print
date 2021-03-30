import React, { useState, useEffect } from 'react'
import {
  Button,
  CloseButton,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  useDisclosure,
  useNumberInput,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react"
import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/layout"

import { HiInformationCircle, HiOutlineCubeTransparent, HiShieldExclamation } from 'react-icons/hi'

import DropZone from './dropzone'
import { ModelViewer } from './model-viewer'


export const Calculator = () => {
  const [models, setModels] = useState([])
  const [materialVolume, setMaterialVolume] = useState(1000)
  const [materialCost, setMaterialCost] = useState(40.99)
  const [totalMaterialCost, setTotalMaterialCost] = useState(0)
  const [totalMaterialVolumeUsed, setTotalMaterialVolumeUsed] = useState(0)
  const [price, setPrice] = useState(0)
  const [profitMargin, setProfitMargin] = useState(0)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [selectedModelIndex, setSelectedModelIndex] = useState(0)

  // update total material cost every time the model changes
  useEffect(() => {
    if (models.length > 0) {
      let runningTotal = 0
      let runningTotalForMaterialVolume = 0
      models.forEach(model => {
        runningTotal += model.materialCostPerModel
        runningTotalForMaterialVolume += parseFloat(model.volume * model.quantity) 
      })

      const fixedRunningTotal = parseFloat(runningTotal.toFixed(2))

      setTotalMaterialCost(fixedRunningTotal)
      setTotalMaterialVolumeUsed(runningTotalForMaterialVolume)
    }

    // reset price when models is empty
    if (models.length === 0) {
      setTotalMaterialCost(0)
      setTotalMaterialVolumeUsed(0)
      setPrice(0)
    }
  }, [models, materialCost, materialVolume])

  // update each model cost whenever material cost or volume is updated
  useEffect(() => {
    if (models.length > 0) {
      const newModels = models.map((model) => {
        return {
          ...model,
          materialCostPerModel: calculateMaterialCostPerModel({
            modelVolume: model.volume,
            modelQuantity: model.quantity,
            modelUnit: model.unit,
            materialVolume: materialVolume,
            materialCost: materialCost,
          }),
        }
      })

      setModels(newModels)
    }
  }, [materialCost, materialVolume])

  // update total price every time model, volume, and cost gets updated.

  useEffect(() => {
    if (models.length > 0) {
      setPrice((totalMaterialCost / (1 - parseFloat(profitMargin))).toFixed(2))
    }
  }, [materialCost, materialVolume, models, totalMaterialCost])

  const handleModelInformation = model => {
    setModels(prev => [
      ...prev,
      {
        bufferGeometry: model.geometry,
        dimensions: {
          x: model.dimensions.x,
          y: model.dimensions.y,
          z: model.dimensions.z,
        },
        fileBlob: model.fileBlob,
        name: model.fileName,
        volume: model.volume,
        materialCostPerModel: calculateMaterialCostPerModel({
          modelVolume: model.volume,
          modelQuantity: model.quantity,
          modelUnit: model.unit,
          materialVolume: materialVolume,
          materialCost: materialCost,
        }),
        quantity: 1,
        unit: "mm",
      },
    ])

        setModels(prev => [
          ...prev,
          {
            bufferGeometry: model.geometry,
            dimensions: {
              x: model.dimensions.x,
              y: model.dimensions.y,
              z: model.dimensions.z,
            },
            fileBlob: model.fileBlob,
            name: model.fileName,
            volume: model.volume,
            materialCostPerModel: calculateMaterialCostPerModel({
              modelVolume: model.volume,
              modelQuantity: model.quantity,
              modelUnit: model.unit,
              materialVolume: materialVolume,
              materialCost: materialCost,
            }),
            quantity: 1,
            unit: "mm",
          },
        ])
  }

  const calculateMaterialCostPerModel = ({
    modelVolume,
    modelUnit = "mm",
    modelQuantity = 1,
    materialCost = 50,
    materialVolume = 1000,
  }) => {
    if (modelUnit === "mm") {
      const cost = (modelVolume * materialCost) / (1000 * materialVolume)

      return cost * modelQuantity
    } else if (modelUnit === `in`) {
      // mm to inch cube conversion
      const cost = (modelVolume * materialCost) / (1000 * materialVolume)
      return cost * modelQuantity
    }
  }


  const handleMaterialVolumeInput = (e) => {
    if(e.target.value >= 0) {
      setMaterialCost(e.target.value)
    }
  }

  const handleUnitChange = (value, id) => {
    setModels(prevState => {
      return models.map((item, itemId) => {
        const volume =
          prevState[itemId].unit === `in`
            ? prevState[itemId].volume / 16387.064069264
            : prevState[itemId].volume * 16387.064069264

        return itemId === id
          ? {
              ...item,
              unit: value,
              volume: volume,
              materialCostPerModel: calculateMaterialCostPerModel({
                modelVolume: volume,
                modelQuantity: item.quantity,
                modelUnit: value,
                materialVolume: materialVolume,
                materialCost: materialCost,
              }),
            }
          : item
      }
      )
    })
  }


  const handleQuantityChange = (value, id) => {
    setModels(
      models.map((item, itemId) =>
        itemId === id
          ? {
              ...item,
              quantity: value,
              materialCostPerModel: calculateMaterialCostPerModel({
                modelVolume: item.volume,
                materialVolume: materialVolume,
                materialCost: materialCost,
                modelQuantity: value,
                modelUnit: item.unit,
              }),
            }
          : item
      )
    )
  }

  
  const handleRemoveModel = id => {
    const filteredModels = models.filter((_, index) => id !== index)
    setModels(filteredModels)
  }

  const handleRemoveAllModels = () => {
    setModels([])
    setTotalMaterialCost(0)
    setPrice(0)
    setTotalMaterialVolumeUsed(0)
  }

  const handlePriceChange = (value) => {
    setPrice(value)
    const profitMargin = calculateProfitMargin({ revenue: value, cost: totalMaterialCost })
    setProfitMargin(profitMargin)
  }

  const handleGeneratePrice = () => {
    setPrice((totalMaterialCost / (1 - parseFloat(profitMargin))).toFixed(2))
  }

  const calculateProfitMargin = ({ revenue, cost }) => {
    if(!revenue || revenue < 0) {
      return 0
    }
    return (revenue - cost) / revenue
  }

  const calculatePrice = ({ cost, margin }) => {
    return (cost / (1 - parseFloat(margin))).toFixed(2)
  }


  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  const numberFormatter = new Intl.NumberFormat()

  return (
    <div>
      <Grid gridTemplateColumns={["", "", "1fr 1fr", "600px auto"]} gap={6}>
        <Stack spacing={5}>
          <Stack>
            <Flex
              sx={{ bg: `green.100`, px: 4, py: 4, borderRadius: `8px` }}
              alignItems="center"
            >
              <Text sx={{ mr: 2 }}>
                <HiInformationCircle />
              </Text>
              <Text fontSize="xs">
                Everything happens on your local browser, so no need to worry
                about me stealing your 3D models.
              </Text>
            </Flex>
          </Stack>
          <DropZone
            getModelInformation={model => handleModelInformation(model)}
          />
          <Stack gridColumn={1} spacing={5}>
            <Flex justifyContent="flex-end">
              <Button colorScheme="red" onClick={handleRemoveAllModels}>
                Remove all
              </Button>
            </Flex>
            {models?.length > 0 &&
              models.map((model, id) => {
                return (
                  <Grid
                    gridTemplateColumns={["auto 1fr"]}
                    sx={{
                      display: [`flex`, `flex`, `flex`, `grid`],
                      flexDirection: `column`,
                    }}
                    shadow="lg"
                    borderWidth="1px"
                    borderRadius={8}
                    key={id}
                    px={4}
                    py={4}
                    gap={2}
                  >
                    <Grid gridRow={["span 2 / auto"]} gridGap={4}>
                      <IconButton
                        variant="outline"
                        aria-label="View 3D model"
                        icon={<HiOutlineCubeTransparent />}
                        fontSize={32}
                        height={100}
                        bg="gray.100"
                        colorScheme="blackAlpha"
                        onClick={() => {
                          setSelectedModelIndex(id)
                          onOpen()
                        }}
                      />
                      <Box>
                        <QuantityInput
                          onQuantityChange={value =>
                            handleQuantityChange(value, id)
                          }
                        />
                      </Box>
                    </Grid>
                    <GridItem
                      gridArea={([], [], ["1 / 2 / auto / auto"])}
                      px={3}
                      sx={{
                        position: `relative`,
                      }}
                    >
                      <Stack>
                        <Text fontWeight="bold" lineHeight={1}>
                          {model.name}
                        </Text>

                        <Text fontSize="xs">
                          <Text
                            as="span"
                            fontWeight="bold"
                            color="blackAlpha.700"
                          >
                            Volume:
                          </Text>
                          <Text fontSize="xs" sx={{ ml: 2 }} as="span">
                            {numberFormatter.format(
                              parseFloat(
                                (model.volume / 1000) * model.quantity
                              ).toFixed(2)
                            )}{" "}
                            mL
                          </Text>
                        </Text>
                      </Stack>
                      <Flex alignItems="center">
                        <Text fontSize="xs">
                          <Text
                            as="span"
                            mr={2}
                            fontWeight="bold"
                            color="blackAlpha.700"
                          >
                            Dimensions:
                          </Text>
                          {model.dimensions.x} x {model.dimensions.y} x{" "}
                          {model.dimensions.z}
                        </Text>
                        <Select
                          value={model.unit}
                          onChange={e => handleUnitChange(e.target.value, id)}
                          width="auto"
                          size="xs"
                          ml={2}
                          fontSize="xs"
                        >
                          <option value="mm">mm</option>
                          <option value="in">in</option>
                        </Select>
                      </Flex>
                      <CloseButton
                        color="red.500"
                        sx={{ position: `absolute`, top: 0, right: 0 }}
                        onClick={() => handleRemoveModel(id)}
                      />
                    </GridItem>
                    <GridItem
                      gridArea={[
                        "3 / span 2 / auto / auto",
                        "3 / span 2 / auto / auto",
                        "2 / 2 / auto / auto",
                      ]}
                      px={3}
                      sx={{
                        display: `flex`,
                        flexDirection: `column`,
                        justifyContent: `flex-end`,
                      }}
                    >
                      <Grid
                        gridTemplateColumns={["", "", "", "1fr"]}
                        gap={4}
                        alignItems="center"
                      >
                        <Flex>
                          <Stat>
                            <StatLabel>Cost</StatLabel>
                            <StatNumber fontSize="md" color="red.500">
                              {formatter.format(model.materialCostPerModel)}
                            </StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel>Price</StatLabel>
                            <StatNumber fontSize="md" color="green.500">
                              {formatter.format(
                                calculatePrice({
                                  cost: model.materialCostPerModel,
                                  margin: profitMargin,
                                })
                              )}
                            </StatNumber>
                          </Stat>
                          <Flex alignItems="center" flex="1">
                            <Text>=</Text>
                          </Flex>
                          <Stat>
                            <StatLabel>Profit</StatLabel>
                            <Flex>
                              <StatNumber fontSize="md">
                                {formatter.format(
                                  Math.abs(
                                    calculatePrice({
                                      cost: model.materialCostPerModel,
                                      margin: profitMargin,
                                    }) - model.materialCostPerModel
                                  )
                                )}
                              </StatNumber>
                            </Flex>
                          </Stat>
                        </Flex>
                      </Grid>
                    </GridItem>
                  </Grid>
                )
              })}
          </Stack>
        </Stack>

        <VStack spacing={"32px"} alignItems="center">
          <VStack spacing={"32px"}>
            <Stack
              as="section"
              borderWidth="1px"
              shadow="lg"
              px={4}
              py={4}
              spacing={4}
              borderRadius="8px"
            >
              <Heading as="h4" size="md">
                Material
              </Heading>
              <Stack>
                <HStack>
                  <Text fontSize="sm" sx={{ mr: 3 }}>
                    Cost:
                  </Text>
                  <Flex alignItems="center" sx={{ position: `relative` }}>
                    <Input
                      type="number"
                      value={materialCost}
                      onChange={handleMaterialVolumeInput}
                      px={6}
                      bg="gray.200"
                    />
                    <Text sx={{ position: `absolute`, left: 3 }} opacity={0.75}>
                      $
                    </Text>
                  </Flex>
                </HStack>
                <HStack>
                  <Text sx={{ mr: 3 }} fontSize="sm">
                    Volume (in mL):
                  </Text>
                  <Flex position="relative" alignItems="center">
                    <Input
                      type="number"
                      value={materialVolume}
                      onChange={e => setMaterialVolume(e.target.value)}
                      bg="gray.200"
                    />
                    <Text
                      sx={{ position: `absolute`, right: 3 }}
                      opacity={0.75}
                    >
                      mL
                    </Text>
                  </Flex>
                </HStack>
                <Flex justifyContent="space-between">
                  <Text fontSize="sm">Cost per mL:</Text>
                  <Text fontSize="sm">
                    ${parseFloat(materialCost / materialVolume).toFixed(4)} / mL
                  </Text>
                </Flex>
                <Divider />
                <Flex alignItems="center" justifyContent="space-between">
                  <Heading as="h4" fontWeight="normal" size="xs">
                    Total Material Volume:
                  </Heading>
                  <Text fontSize="sm">
                    {numberFormatter.format(
                      totalMaterialVolumeUsed.toFixed(2) / 1000
                    )}{" "}
                    mL
                  </Text>
                </Flex>
                <Flex alignItems="center" justifyContent="space-between">
                  <Heading as="h4" size="xs">
                    Total Material Cost:
                  </Heading>
                  <Text color="red.600">
                    {formatter.format(totalMaterialCost)}
                  </Text>
                </Flex>
              </Stack>
            </Stack>
            <Stack
              as="section"
              borderWidth="1px"
              shadow="lg"
              px={4}
              py={4}
              spacing={4}
              borderRadius="8px"
              width="100%"
            >
              <Heading as="h4" size="md">
                Pricing
              </Heading>
              <Stack spacing={4}>
                <Heading as="h5" size="xs">
                  Profit margin
                </Heading>
                <ProfitMarginSelector
                  onChange={value => {
                    setProfitMargin(parseFloat(value))
                    setPrice(
                      (totalMaterialCost / (1 - parseFloat(value))).toFixed(2)
                    )
                  }}
                />
                <div>
                  <ProfitMarginSlider
                    value={parseInt(profitMargin * 100)}
                    onChange={value => {
                      setProfitMargin(parseFloat(value / 100))
                      setPrice(
                        (
                          totalMaterialCost /
                          (1 - parseFloat(value / 100))
                        ).toFixed(2)
                      )
                    }}
                  />
                </div>
                <Stack spacing={3}>
                  <Heading as="h5" sx={{ mr: 3 }} size="xs" fontWeight="bold">
                    Total Price:
                  </Heading>
                  <HStack position="relative" spacing={3}>
                    <Flex alignItems="center">
                      <Text sx={{ position: `absolute`, left: 3, zIndex: 1 }}>
                        $
                      </Text>
                      <Input
                        type="number"
                        value={price}
                        onChange={e => handlePriceChange(e.target.value)}
                        px={6}
                        size="lg"
                        backgroundColor={`gray.200`}
                        sx={{ position: `relative` }}
                        fontWeight="bold"
                        fontSize="2xl"
                      />
                    </Flex>
                  </HStack>
                </Stack>
              </Stack>
            </Stack>
          </VStack>
        </VStack>
      </Grid>
      <ModelViewer
        isOpen={isOpen}
        onClose={onClose}
        models={models}
        startingModelIndex={selectedModelIndex}
      />
    </div>
  )
}

const QuantityInput = ({ onQuantityChange }) => {
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    valueAsNumber,
  } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
  })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  useEffect(() => {
    if (valueAsNumber) {
      onQuantityChange && onQuantityChange(valueAsNumber)
    }

  }, [valueAsNumber])

  return (
    <HStack maxW="320px">
      <Button {...inc} size="sm">
        +
      </Button>
      <Input {...input} width="80px" textAlign="center" size="sm" />
      <Button {...dec} size="sm">
        -
      </Button>
    </HStack>
  )
}

const RadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box
      as="label"
      sx={{ width: `100%`, display: `flex`, justifyContent: `center` }}
    >
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        px={4}
        py={3}
      >
        <Text textAlign="center">{props.children}</Text>
      </Box>
    </Box>
  )
}

const MaterialVolumeSelector = ({ onChange }) => {
  const options = [500, 1000]

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "material-volume-selector",
    onChange: onChange,
  })

  const group = getRootProps()

  return (
    <HStack {...group}>
      {options.map((value, id) => {
        const radio = getRadioProps({ value })
        return (
          <RadioCard key={id} {...radio}>
            {value}
          </RadioCard>
        )
      })}
    </HStack>
  )
}

const ProfitMarginSelector = ({ onChange }) => {
    const options = [0, 0.25, 0.5, 0.75]

    const { getRootProps, getRadioProps } = useRadioGroup({
      name: "profit-margin",
      onChange: onChange,
    })

    const group = getRootProps()

    return (
      <HStack {...group}>
        {options.map((value, id) => {
          const radio = getRadioProps({ value })
          return (
            <RadioCard key={id} {...radio}>
              {value * 100}%
            </RadioCard>
          )
        })}
      </HStack>
    ) 
}

const ProfitMarginSlider = ({ value, onChange }) => {
  return (
    <Flex>
      <NumberInput
        maxW="100px"
        mr="2rem"
        value={value >= 0 ? value : 0}
        onChange={onChange}
        min={0}
        max={99}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider
        flex="1"
        focusThumbOnChange={false}
        value={value >= 0 ? value : 0}
        onChange={onChange}
        max={99}
        min={0}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px" children={value >= 0 ? value : 0} />
      </Slider>
    </Flex>
  )
}