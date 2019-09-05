'use strict'

/**
 * Dependencies
 */

const meow = require('meow')
const chalk = require('chalk')
const figlet = require('figlet')
const prompts = require('prompts')
const showHelp = require('../helpers/showHelp')

/**
 * Constants
 */

const directions = {
  'n': 'north',
  's': 'south',
  'e': 'east',
  'w': 'west',
}

/**
 * Parse args
 */

const cli = meow(`
  Usage
    $ cast adventure
`)

/**
 * Define Player
 */

class Player {
  health = 100

  constructor(map, area) {
    this.map = map
    this.current_area = area
  }

  move(direction) {
    const next_area = this.current_area[directions[direction]]

    if (next_area) {
      console.log(chalk.green.bold(`*Move ${directions[direction].toUpperCase()}*\n`))
      this.current_area = this.map.area(next_area)
    } else {
      console.log(chalk.yellow.bold(`*You try to move ${directions[direction].toUpperCase()}, but the way is blocked*.\n`))
    }

    this.health -= 5
  }

  take(action) {
    console.log(chalk.white.bold('Take\n'))
  }
  
  drop(action) {
    console.log(chalk.white.bold('Drop\n'))
  }

  inventory() {
    console.log(chalk.white.bold('Inventory\n'))
  }
}

/**
 * Define Area
 */

class Area {
  constructor({ name, description, north = null, south = null, east = null, west = null}) {
    this.name = name
    this.description = description
    this.north = north
    this.south = south
    this.east = east
    this.west = west
  }
}

/**
 * Define Item
 */

class Item {
  constructor({ name, description, health }) {
    this.name = name
    this.description = description
    this.health = health

    if (this.health > 0) {
      this.rng = Math.floor(Math.random() * 100)
    } else {
      this.rng = Math.floor(Math.random() * 100) + 15
    }
  }
}

/**
 * Define Activity
 */

class Activity {
  constructor({ name, description, health }) {
    this.name = name
    this.description = description
    this.health = health

    if (this.health > 0) {
      this.rng = Math.floor(Math.random() * 100)
    } else {
      this.rng = Math.floor(Math.random() * 100) + 15
    }
  }
}

class Map {
  constructor() {
    this.areas = []

    this.areas = this.areas.concat(
      new Area({ name: 'Outside', description: 'Any direction will do.', north: 'Fairy Asylum', south: 'Crimson Sanctum', east: 'Dining Room of the Sigl', west: 'Watchtower of Ending' }),
      new Area({ name: 'Fairy Asylum', description: "You pass through a twisted trail that leads passed countless rooms and soon you enter a dark area. Small holes and carved paths cover the walls, it looks like a community or burrow for small creatures.", south: 'Outside', west: 'Desolate Prison of the Miners' }),
      new Area({ name: 'Crimson Sanctum', description: "A narrow granite door in a gloomy thicket marks the entrance ahead. Beyond the granite door lies a large, clammy room. It's covered in rat droppings, dead insects and puddles of water. Your torch allows you to see what seems like some form of a sacrificial chamber, destroyed and absorbed by time itself.", north: 'Outside' }),
      new Area({ name: 'Dining Room of the Sigl', description: "Inside the room looks warm and cozy. It has been built with red bricks and has brown stone decorations. Tall, large windows brighten up the room and have been added in a fairly symmetrical pattern.", east: 'Room of Knowledge', west: 'Outside' }),
      new Area({ name: 'Room of Knowledge', description: "Inside the room looks grandiose. It has been built with wheat colored bricks and has granite decorations. Small, triangular windows let in plenty of light and have been added to the room in a mostly symmetric way.", west: 'Dining Room of the Sigl' }),
      new Area({ name: 'Desolate Prison of the Miners', description: "Beyond the boulder lies a large, dusty room. It's covered in remains, broken stone and rubble.", east: 'Fairy Asylum' }),
      new Area({ name: 'Watchtower of Ending', description: "You pass many rooms and passages, it's one big labyrinth of twists and turns. You eventually make it to what is likely the final room. A mysterious granite door blocks your path. Dried blood splatters are all over it, you enter cautiously.", east: 'Outside' }),
    )
    // new Item({ name: 'Glowing Ignot', description: 'You pickup something glowing on the ground.', health: -15 })
    // new Activity({ name: 'Apple Tree', description: 'You reach up and eat an apple.', health: 5 })
  }

  area(name) {
    return this.areas.find(area => area.name === name)
  }
}

/**
 * Define script
 */

async function adventure() {
  showHelp(cli)

  console.log('')
  console.log(chalk.white.bold(figlet.textSync('ADVENTURE', { font: 'Bright' })))
  console.log('')

  let map = new Map()
  let main_player = new Player(map, map.area('Outside'))
  console.log(chalk.white.bold('*You wake up*\n'))
  
  while (true) {
    let response = await prompts({
      type: 'text',
      name: 'action',
      message: () => {
        if (main_player.health < 20) {
          return chalk.red.bold('(╯°□°）╯︵ ┻━┻')
        } else if (main_player.health < 50) {
          return chalk.yellow.bold('(ಠ_ಠ)')
        } else {
          return chalk.green.bold('(ʘ‿ʘ)')
        }
      }
    })
    console.log('')

    if (main_player.health <= 0 || ['q', 'quit'].includes(response.action)) {
      main_player.health = 0
      console.log(chalk.red.bold('*Death by exhaustion*\n'))
      console.log(chalk.white.bold('// GAME OVER\n'))
      process.exit(0)
    } else if (['n', 's', 'e', 'w'].includes(response.action)) {
      main_player.move(response.action)
    } else if (response.action.match(/^get|^take/)) {
      main_player.take(response.action)
    } else if (response.action.match(/^drop/)) {
      main_player.drop(response.action)
    } else if (['i', 'inventory'].includes(response.action)) {
      main_player.inventory(response.action)
    } else {
      main_player.health -= 5
      console.log(chalk.yellow.bold('*You stare up in confusion*\n'))
    }
  }
}

/**
 * Export script
 */

module.exports = adventure
