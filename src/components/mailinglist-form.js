import React from 'react'
import ConvertKitForm from "convertkit-react"
import { chakra, useStyleConfig } from '@chakra-ui/system'

const CKForm = chakra(ConvertKitForm)

export const MailinglistForm = () => {
  const buttonStyle = useStyleConfig("Button", { colorScheme: `blue` })
  const inputStyle = useStyleConfig("Input")

  return (
    <CKForm
      formId={2160921}
      hideName={true}
      newTab={true}
      sx={{
        display: `flex`,
        button: {
          ...buttonStyle,
          minWidth: `125px`,
          ml: 2,
        },
        input: {
          ...inputStyle.field,
        },
      }}
    />
  )
}