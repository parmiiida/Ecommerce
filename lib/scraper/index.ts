import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from "../utils";


export async function scrapeAmazonProduct(url : string){
    if(!url) return;


    //bright data proxy configuration
    //gonna ensure that we can actually use brightdata scraping

    //curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_347b8948-zone-pricewise:4t3g7rlxtf4v -k https://lumtest.com/myip.json
    const username = String(process.env.BRIGHT_DATA_USERNAME)
    const password = String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 22225
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth:{
            username: `${username}-session-${session_id}`,
            password,
        },
        host:'brd.superproxy.io',
        port,
        rejectUnauthorised:false,
    }

    try{
        //fetching amazon product page

        const response =  await axios.get(url ,options)

        //initialize cheerio
        const $ = cheerio.load(response.data);

        //extract product title
        //as long as the elemet has id we use id
        const title = $('#productTitle').text().trim();

        //if the element doesnt ahve id we use the clasnames of that element
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),

          );

          const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
          );

          const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

          const images =
          $('#imgBlkFront').attr('data-a-dynamic-image') ||
          $('#landingImage').attr('data-a-dynamic-image') ||
          '{}'

        const imageUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('.a-price-symbol'))
        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

        const description = extractDescription($)

        // Construct data object with scraped information
        const data = {
          url,
          currency: currency || '$',
          image: imageUrls[0],
          title,
          currentPrice: Number(currentPrice) || Number(originalPrice),
          originalPrice: Number(originalPrice) || Number(currentPrice),
          priceHistory: [],
          discountRate: Number(discountRate),
          category: 'category',
          reviewsCount:100,
          stars: 4.5,
          isOutOfStock: outOfStock,
          description,
          lowestPrice: Number(currentPrice) || Number(originalPrice),
          highestPrice: Number(originalPrice) || Number(currentPrice),
          averagePrice: Number(currentPrice) || Number(originalPrice),
        }

        return data;
      } catch (error: any) {
        console.log(error);
      }
    }