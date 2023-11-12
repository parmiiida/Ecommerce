'use server'

import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../mongoose";


//function for scraping the product as well as saving it in our data base bcz we want to know
//and track the price
export async function scrapeAndStoreProduct(productUrl : string){
     if(!productUrl) return;

     try{

      connectToDB()
        //scrape the product
        const scrapedProduct = await scrapeAmazonProduct(productUrl)
        if(!scrapedProduct) return;
     }catch(error : any){
        throw new Error(`Faild to create/update product: ${error.message}`)
     }
}