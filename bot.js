const {promisify} = require('util')
const fs = require('fs')
const writeFile = promisify(fs.writeFile)
const request = require('request')

let url = 'https://auto.ria.com/uk/auto_lexus_gs_33857869.html';

const getHTML = async (url) => 
    new Promise((resolve, reject) => 
        request(url, (err, res, body) => err ? reject(err) : resolve(body))
    )

const getData = async (url) => {
    try{
        let originalPage = await getHTML(url)
        isExist = originalPage.match(new RegExp(/<div class="ticket-status-\d{1,2}">/g))
        if(isExist){
            let updatedPage = originalPage.replace(/<div class="ticket-status-\d{1,2}">/g, '<div class="ticket-status-0">')
            writeFile('./fin2-index.html', updatedPage, 'utf8')
        }
        console.log("isExist: " + isExist)
    } catch (error){
        console.log(error.message)
    }
}

getData(url)