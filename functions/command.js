const numbers = [
  ':one:',
  ':two:',
  ':three:',
  ':four:',
  ':five:',
  ':six:',
  ':seven:',
  ':eight:',
  ':nine:',
  ':keycap_ten:'
]

const split = (str) => {
  return str.match(/\\?.|^$/g).reduce((p, c) => {
    if (c === '"') {
      p.quote ^= 1
    } else if (!p.quote && c === ' ') {
      p.a.push('')
    } else {
      p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1')
    }
    return p
  }, {a: ['']}).a
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.freePoll = (req, res) => {
  console.log(req.body)

  const args = split(req.body.text)

  if (args.length < 0) {
    return res.status(200).send({text: 'Question and at least 2 options required'})
  }

  const actions = []

  const attachments = args.slice(1).map((option, i) => {
    const text = `${numbers[i]} ${option}`

    actions.push({
      name: `${numbers[i]}`,
      text: `${numbers[i]}`,
      type: 'button',
      value: JSON.stringify({index: i, response: []})
    })

    return {
      fallback: text,
      title: text,
      color: '#3AA3E3',
      attachment_type: 'default'
    }
  })

  attachments.push({
    callback_id: 'option',
    color: '#3AB3E3',
    attachment_type: 'default',
    actions
  })

  res.status(200).send({
    response_type: 'in_channel',
    text: `*${args[0]}* - @${req.body.user_name}`,
    attachments
  })
}
