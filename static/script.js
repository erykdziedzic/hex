const saveBoard = (levelData) =>
  fetch('/level', {
    method: 'POST',
    body: JSON.stringify(levelData),
    headers: { 'Content-Type': 'application/json' },
  })

const getLevelData = () => fetch('/level').then(async (res) => res.json())

const getNewDirection = (direction) => String((parseInt(direction) + 1) % 6)

class HexBoard {
  constructor() {
    this.quantity = $('#numSel').val()
    this.levelData = {
      level: [],
    }

    this.hexesLocation = []
    this.mode = 'walls'
  }

  createBoard() {
    this.clearBoard()
    this.displayLevelData()
    this.createBoardUI()
    const that = this
    $('.hex').on('click', function () {
      that.addHex(this)
    })
  }

  clearBoard() {
    $('#box').html('')
    this.quantity = $('#numSel').val()
    this.levelData = { size: this.quantity, level: [] }
  }

  createBoardUI() {
    for (let i = 0; i < this.quantity; i++) {
      for (let j = 0; j < this.quantity; j++) {
        this.createHex(i, j)
      }
    }
  }

  createHex(i, j) {
    const left = i * 90
    const columnNumIsEven = i % 2 === 0

    const top = columnNumIsEven ? j * 100 : j * 100 + 50
    const hexElement = $('<div>')
      .addClass('hex')
      .attr('id', i * this.quantity + j)
      .css('left', `${left}px`)
      .css('top', `${top}px`)
    $('#box').append(hexElement)
    this.hexesLocation.push({ x: i.toString(), y: j.toString() })
  }

  resetBoard() {
    $('#jsonText').val('')
    this.createBoard()
  }

  loadBoardData(data) {
    $('#numSel').val(data.size)
    this.resetBoard()
    this.levelData = data
    this.displayLevelData()

    for (const el in data.level) {
      const arrow = $('<div>').addClass('arrow').html('<br>0')
      $(`#${data.level[el].id}`).append(arrow)

      this.rotateArrow(data.level[el].id, data.level[el].dirOut)
    }
  }

  addHex(target) {
    const id = target.id
    const oldHex = this.findHexInLevelData(id)

    if (oldHex !== undefined) {
      this.updateHex(oldHex)
    } else {
      const newHex = {
        id,
        x: this.hexesLocation[id].x,
        z: this.hexesLocation[id].y,
        dirOut: '0',
        dirIn: '3',
        type: this.mode,
      }
      this.levelData.level.push(newHex)

      const arrow = $('<div>').addClass('arrow').html('<br>0')
      $(target).append(arrow)
    }
    this.displayLevelData()
  }

  findHexInLevelData(hexId) {
    return this.levelData.level.find((hex) => hex.id === hexId)
  }

  updateHex(hex) {
    const newDirIn = getNewDirection(hex.dirIn)
    const newDirOut = getNewDirection(hex.dirOut)
    hex.dirIn = newDirIn
    hex.dirOut = newDirOut
    hex.type = this.mode
    this.rotateArrow(hex.id, newDirOut)
  }

  rotateArrow(id, direction) {
    const degrees = parseInt(direction) * 60
    $(`#${id}`)
      .children(0)
      .html('<br>' + direction)
      .css({ transform: 'rotate(' + degrees + 'deg)' })
  }

  displayLevelData() {
    $('#jsonText').val(JSON.stringify(this.levelData, null, 4))
  }
}

$(document).ready(function () {
  const board = new HexBoard()
  board.createBoard()

  $('#numSel').on('change', () => board.resetBoard())

  $('.typeBtn').click(function () {
    $('.typeBtn').css('background-color', 'lightgray').css('color', 'black')
    $(this).css('background-color', 'green').css('color', 'white')
    board.mode = $(this).html().toLowerCase()
  })

  $('#saveBtn').click(() => saveBoard(board.levelData))
  $('#loadBtn').click(async () => board.loadBoardData(await getLevelData()))
})
