const https = require('https')
const fs = require('fs')
const path = require('path')

// Real Slough images from Wikimedia Commons
const sloughImages = [
  {
    name: 'slough-precinct.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Wellington_Way%2C_Slough_-_geograph.org.uk_-_1724736.jpg/1280px-Wellington_Way%2C_Slough_-_geograph.org.uk_-_1724736.jpg',
    description: 'Slough town center'
  },
  {
    name: 'slough-street.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/London_Road%2C_Slough_-_geograph.org.uk_-_1507242.jpg/1280px-London_Road%2C_Slough_-_geograph.org.uk_-_1507242.jpg',
    description: 'London Road, Slough'
  },
  {
    name: 'cowplain.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Cowplain_-_geograph.org.uk_-_1724723.jpg/1280px-Cowplain_-_geograph.org.uk_-_1724723.jpg',
    description: 'Cowplain area'
  }
]

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        console.log(`Downloaded: ${filepath}`)
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}) // Delete partial file
      reject(err)
    })
  })
}

async function downloadAll() {
  const baseDir = path.join(__dirname, '../public/images/slough')
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true })
  }

  for (const img of sloughImages) {
    const filepath = path.join(baseDir, img.name)
    try {
      await downloadImage(img.url, filepath)
    } catch (err) {
      console.error(`Failed to download ${img.name}:`, err)
    }
  }
  
  console.log('All images downloaded!')
}

downloadAll()
