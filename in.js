const {promisify} = require('util')
const fs = require('fs')
const writeFile = promisify(fs.writeFile)
const request = require('request')

let url = 'https://auto.ria.com/uk/auto_lexus_gs_33857869.html';

// const readFile = () => 
//     new Promise((resolve, reject) => 
//         fs.readFile('./google-index.html', 'utf8', (err, data) => err ? reject(err) : resolve(data))
//     )
  
const readFile = async () => 
    new Promise((resolve, reject) => 
        fs.readFile('./google-index.html', 'utf8', (err, data) => err ? reject(err) : resolve(data))
    )

const getHTML = () => 
    new Promise((resolve, reject) => 
        request(url, (err, res, body) => err ? reject(err) : resolve(body))
    )

const findData = async () => {
    // let pageData = await getHTML()
    let pageData = await readFile()
    
    if(pageData.match(new RegExp(/<div class="ticket-status-\d{1,2}">/g))){
        console.log("We find it!")
        return pageData.replace(/<div class="ticket-status-\d{1,2}">/g, '<div class="ticket-status-0">')
       } else console.log('Not found')
    }

const updateData = async () => {
    console.log('2 - replaceDiv')
        let pageData = await getHTML()
        return pageData.replace(/<div class="ticket-status-\d{1,2}">/g, '<div class="ticket-status-0">')
    }

const saveFile = async () => {
    console.log('1 - saveFile')
    try {
        writeFile('./fin2-index.html', await findData(), 'utf8')
        } catch(err) {
        console.log(err)
    }
}
    
saveFile()