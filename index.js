require('dotenv').config()
const fs = require('fs')
const ObjectsToCsv = require('objects-to-csv');
const path = require('path')

// Google Play
const gplay = require('google-play-scraper').memoized({
  maxAge: 1000 * 60 * 60, // cache for 5 minutes
  max: 10000 // save up to 1k results to avoid memory issues
});

const govBrApp = {
  googlePlayId: process.env.GOOGLEPLAY_ID,
  appStoreId: APPSTORE_ID
}

gplay.reviews({
  appId: govBrApp.googlePlayId,
  sort: gplay.sort.RATING,
  num: 500000,
  throttle: 100,
  lang: 'pt',
  country: 'br'
})
// .then(({data}) => {
//   console.log(data)
// })
.then(async({data}) => {
  const csv = new ObjectsToCsv(data);
 
  // Save to file:
  await csv.toDisk('./googlePlay_reviews_govBr.csv');

  await fs.writeFileSync(path.join('./googlePlay_reviews_govBr.json'), 
                        JSON.stringify(data))
 
  // Return the CSV file as string:
  console.log(await csv.toString());
})
.catch(console.log)


// AppStore limited to 500 reviews total
// var store = require('app-store-scraper').memoized({
//   maxAge: 1000 * 60 * 60, // cache for 5 minutes
//   max: 10000 // save up to 1k results to avoid memory issues
// });

// AppStore scrap limited to 50 reviews per page, max 10 pages
// store.reviews({
//   id: govBrApp.appStoreId,
//   sort: store.sort.HELPFUL,
//   page: 1,
//   throttle: 100,
//   lang: 'pt',
//   country: 'br'
// })
// .then(async(reviews) => {
//   const csv = new ObjectsToCsv(reviews);
 
//   // Save to file:
//   await csv.toDisk('./appStore_reviews_govBr.csv');

//   await fs.writeFileSync(path.join('./appStore_reviews_govBr.json'), 
//                         JSON.stringify(reviews))
 
//   // Return the CSV file as string:
//   console.log(await csv.toString());
// })
// .then(reviews => console.log(reviews.length))