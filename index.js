require('dotenv').config();
const {promisify} = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const request = require('request');
let isExist;   
const {Bot, Keyboard, GrammyError, HttpError} = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

bot.on('::url', async (ctx) =>{
  console.log('ctx: ' + ctx);
  await getData(ctx);
  await ctx.reply(isExist);
})

bot.api.setMyCommands([
  {
    command: 'start', description: 'Запуск бота',
  },
  {
    command: 'get_info', description: 'Запуск бота',
  },
  {
    command: 'check', description: 'Перевірити чи можливо відновити данні',
  },
  {
    command: 'get_data', description: 'Отримати відновлену сторінку',
  }
])

bot.command('start', async (ctx) => {
  const startKeyboard = new Keyboard().text('Які видалені оголошення з Auto.RIA можна відновити?').row().text('Отримати інформацію з видаленого оголошення на Auto.RIA').resized();
    await ctx.reply('Hello!');
    await ctx.reply('choice', {
        reply_markup: startKeyboard
    })
} )

bot.on('message', async (ctx) => 
  await ctx.reply('Не вірна команда'));

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
});

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

bot.start();