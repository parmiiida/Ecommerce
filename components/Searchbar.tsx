'use client'

import { scrapeAndStoreProduct } from '@/lib/actions';
import React, { FormEvent, useState } from 'react'

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if(
      hostname.includes('amazon.com') ||
      hostname.includes ('amazon.') ||
      hostname.endsWith('amazon')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}


const Searchbar = () => {

  //keep track of the url we entered
  const [searchPrompt, setSearchPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async(event : FormEvent<HTMLFormElement>) =>{
      event.preventDefault()

      const isValidLink = isValidAmazonProductURL(searchPrompt)

      if(!isValidLink) return alert('Please provide a valid Amazon link')

      try{
        setIsLoading(true)

        //scrape our first product page
        const product = await scrapeAndStoreProduct(searchPrompt )
      }catch(error){
        console.log(error)
        // this (finnally) will happen either way on try or catch
      }finally{
        setIsLoading(false)
      }
    }


  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
      <input type='text'
      value={searchPrompt}
      onChange={(e) => setSearchPrompt(e.target.value)}
      placeholder='Enter product link'
      className='searchbar-input'/>

      <button type='submit'
       className='searchbar-btn'
       //if the input is empty then the button is disabled
       disabled={searchPrompt===''}>
        {isLoading ? 'Searching... ' : 'search'}
      </button>
    </form>
  )
}

export default Searchbar
