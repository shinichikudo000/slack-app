import { SearchBarProps } from '@/_types/types'
import { Input } from '@/components/ui/input'
import React from 'react'

const SearchBar = ({onChange, value}: SearchBarProps) => {
  return (
    <>
        <Input 
        type='text'
        placeholder='Search Contacts'
        value={value}
        onChange={(e) => onChange(e.target.value)
        }/>
    </>
  )
}

export default SearchBar