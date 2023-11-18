import React from 'react'
import Image from 'next/image'
import Searchbar from '@/components/Searchbar'
import HeroCarousel from '@/components/HeroCarousel'
import { getAllProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'


//for making call to our server we use async function (for fetching data actually)

const Home = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
      <section className='px-6 md:px-20 py-24 '>
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center'>
            <p className='small-text'>
              Smart shopping Starts Here:
              <Image src='/assets/icons/arrow-right.svg'
              alt='arrow-right'
              width={16}
              height={16}/>
            </p>

            <h1 className='head-text'>
              Unleash the power of
              <span className='text-primary'> PriceWise</span>
            </h1>

            <p className='mt-6'>
               Powerful, self-serve product and growth analytics to help you convert,
                engage, and retain more.
            </p>

            <Searchbar/>
          </div>

          <HeroCarousel/>
        </div>
      </section>

      <section className='trending-section'>
        <h2 className='section-text'>Trending</h2>

        <div className='gap-x-8 gap-y-16 flex flex-wrap'>
          {allProducts?.map((product)=>(
            <div>
              <ProductCard key={product._id} product={product} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
