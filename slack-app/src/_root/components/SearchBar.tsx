import { Input } from '@/components/ui/input'
import React from 'react'

interface SearchBarProps {
    onChange: (value: string) => void
}

const SearchBar = ({onChange}: SearchBarProps) => {
  return (
    <>
        <Input 
        type='text'
        placeholder='Search Contacts'
        onChange={(e) => onChange(e.target.value)}/>
    </>
  )
}

export default SearchBar