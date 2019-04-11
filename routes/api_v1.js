const express = require('express');
const fetch = require('node-fetch'); 
const cheerio = require('cheerio');
const fs = require('fs');
const router = express.Router();
const admin = require("firebase-admin")
const db = admin.firestore()

router.get('/url_to_title', function(req, res, next) {
  if(!req.query.url)
    return
  const url = req.query.url
  const info = getPageInfo(url)
  info.then(data => {
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(data);
  }).catch(err => {
    console.log(err)
  });
});


async function getPageInfo(url) {
  const metaProps = await getMetaProps(url)
  const site_name = resolveSiteName(metaProps)
  const title = resolveTitle(metaProps)
  const description = resolveDesc(metaProps)
  const image = resolveImageUrl(metaProps)
  return { site_name, title, description, image }
}


function resolveSiteName(metaProps) {
  const ogSiteName = getMetaPropContent(metaProps, 'og:site_name')
  if (ogSiteName)
    return ogSiteName
  return '(No SiteName)'
}


function resolveTitle(metaProps) {
  var ogTitle = getMetaPropContent(metaProps, 'og:title')
  if (ogTitle)
    return ogTitle
  else if(ogTitle = getMetaPropContent(metaProps, 'title'))
    return ogTitle
  return '(No Title)'
}


function resolveDesc(metaProps) {
      const ogDesc = getMetaPropContent(metaProps, 'og:description')
      if (ogDesc) return ogDesc
      return ''
}

function resolveImageUrl(metaProps) {
      const ogImage = getMetaPropContent(metaProps, 'og:image')
      if (ogImage) return ogImage
      return ''
}

function getMetaPropContent(metaProps, propKey) {
      const mpObj = metaProps.find((d, i, arr) => {
              return d[propKey]
            })
      if (mpObj) return mpObj[propKey]
      return ''
}


// @platong Fetch body and extract ogp from it.
async function getMetaProps(url) {
  const result = await fetch(url).then(res => {
    if (res.ok) { 
      return res.text()
    }
  }).then(html => {
    const metaProps = extractMetaProps(html)
    return metaProps
  }).catch(e => {
    throw e
  })
  return result
}


// @platong It gets not only OGP but also meta title.
function extractMetaProps(html) {
  const $ = cheerio.load(html)
  let results = []
  $('head meta').each((i, el) => {
    const property = $(el).attr('property')
    const content = $(el).attr('content')
    const name = $(el).attr('name')
    if (property && content) {
      results.push({ [property]: content })
    } else if(name && content) {
      results.push({ [name]: content })
    }
  })

  let title =  $('head title').text()
  if(title){
    results.push({ "title": title })
  }

  results.sort((a,b) => {
    if (Object.keys(a)[0] < Object.keys(b)[0]) return -1
    if (Object.keys(a)[0] > Object.keys(b)[0]) return 1
    return 0
  })

  return results
}


router.get("/sets", (req, res) => {
  let myAId = req.query.myAId
  let promises = [ 
    db.collection("account").doc(myAId).collection("folders")
      .get().then(snaps => {
      return snaps.docs.map(x => {
        let d = x.data()
        d.id = x.id
        d.kind = "folders"
        return JSON.stringify(d)
      })  
    }).catch(e => {
      console.log(e)
    }), 
    db.collection("account").doc(myAId).collection("myfreefolders")
      .get().then(snaps => {
      return snaps.docs.map(x => {
        let d = x.data()
        d.id = x.id
        d.kind = "myfreefolders"
        return JSON.stringify(d)
      })  
    }).catch(e => {
      console.log(e)
    }) 
  ]
  Promise.all(promises).then(setsList => {
    let sets = setsList[0].concat(setsList[1])
    res.header("Content-Type", "application/json; charset=utf-8")
    res.send({
      body: sets.join("-@-"),
      state: "200"
    })  
  }).catch(e => {
    console.error(e)
  })
})


module.exports = router;
