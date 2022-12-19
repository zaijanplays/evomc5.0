const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')

const config = require('./config.json')
const { keep_alive } = require("./keep_alive");

const host = config.SERVER.host
const port = config.SERVER.port
const username = config.BOT.username
const version = config.BOT.version
const pass = config.BOT.password
const auth = config.BOT.auth

function createBot() {
    
const bot = mineflayer.createBot({
  host: host,
  username: username,
  password: pass,
  port: port,
  version: version,
  auth: auth
})

bot.once("spawn", () => {
    if (config.DASHBOARD.enabled) {
        
    } else {
  console.log(`\x1b[35m[BotLog] \x1b[33m${username} Joined The Server\x1b[0m`)
    }
  if (config["AUTO-AUTH"].enabled) {

      var password = config["AUTO-AUTH"].password
      setTimeout(() => {
        bot.chat(`/register ${password} ${password}`)
        bot.chat(`/login ${password}`)
      }, 500)
  }
})

bot.on("chat", (username, message) => {
  if (message === "-sleep") {
    bot.chat('/sleep')
  }
  })

bot.once("spawn", () => {
    if (true) {
      var messages = ["USE : -help for my commands"]

      if (true) {
        var delay = 1200
        let i = 0

        setInterval(() => {
          bot.chat(`${messages[i]}`)

          if (i + 1 == messages.length) {
            i = 0
          } else i++
        }, delay *4000)
      } else {
        messages.forEach((msg) => {
          bot.chat(msg)
        })
      }
    }
  })

  if (config["ANTI-AFK"].enabled) {
    bot.setControlState("jump", true)
  }

bot.on("chat", (username, message) => {
  if (message === "-help") {
    bot.chat('My Commands: [ -pos | -sleep ]')
  }
  
  if (message === "w") {
    bot.setControlState("forward", true)
  setTimeout(() => {
    bot.setControlState("forward", false)
    }, 230)
  }

  if (message === "s") {
    bot.setControlState("back", true)
  setTimeout(() => {
    bot.setControlState("back", false)
    }, 230)
  }

  if (message === "d") {
    bot.setControlState("left", true)
  setTimeout(() => {
    bot.setControlState("left", false)
    }, 230)
  }

  if (message === "a") {
    bot.setControlState("right", true)
  setTimeout(() => {
    bot.setControlState("right", false)
    }, 230)
  }

  if (message === "-jump") {
    bot.setControlState("jump", true)
    bot.setControlState("jump", false)
    }

  if (message === "-pos") {
    bot.chat(bot.entity.position.toString())
    }
})

const RANGE_GOAL = 1 // ficar dentro deste raio do jogador

bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
  const mcData = require('minecraft-data')(bot.version)
  const defaultMove = new Movements(bot, mcData)

  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message !== '-come') return
    const target = bot.players[username]?.entity
    if (!target) {
      bot.chat("I Can't See You!")
      return
    }
    const { x: playerX, y: playerY, z: playerZ } = target.position

    bot.pathfinder.setMovements(defaultMove)
    bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL))
  })
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  switch (message) {
    case '-sleepinbed':
      goToSleep()
      break
    case '-wakeup':
      wakeUp()
      break
  }
})

bot.on('sleep', () => {
  bot.chat('Good Night!')
})
bot.on('wake', () => {
  bot.chat('Good Morning!')
})

async function goToSleep () {
  const bed = bot.findBlock({
    matching: block => bot.isABed(block)
  })
  if (bed) {
    try {
      await bot.sleep(bed)
      bot.chat("I'm Sleeping")
    } catch (err) {
      bot.chat(`I Can't Sleep: ${err.message}`)
    }
  } else {
    bot.chat('No Nearby Bed')
  }
}

async function wakeUp () {
  try {
    await bot.wake()
  } catch (err) {
    bot.chat(`I Can't Wakeup: ${err.message}`)
  }
}

if (config.DASHBOARD.enabled) {

bot.loadPlugin(require("mineflayer-dashboard"))

} else {
    
    bot.on('message', (message) => {
  console.log(`\x1b[31m[ServerChat]\x1b[0m ${message.toAnsi()}`)
})

}

if (config.LOOKER.enabled) {
bot.once('spawn', function () {
  setInterval(() => {
    const entity = bot.nearestEntity()
    if (entity !== null) {
      if (entity.type === 'player') {
        bot.lookAt(entity.position.offset(0, 1.6, 0))
      } else if (entity.type === 'mob') {
        bot.lookAt(entity.position)
      }
    }
  }, 50)
})
}

// Erros de log e motivos de kick:
bot.on('kicked', console.log)
bot.on('error', console.log)
bot.on('death', () => {
    console.log(`\x1b[35m[BotLog] \x1b[33m${username} Died\x1b[0m`)
})

bot.on('end', () => {
    setTimeout(() => {
        createBot()
    }, 5000)
})

}
createBot()
