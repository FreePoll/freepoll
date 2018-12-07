/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.options = (req, res) => {
  const payload = JSON.parse(req.body.payload)
  const message = payload.original_message
  const action = payload.actions[0]
  const value = JSON.parse(action.value)
  const actionIndex = value.index

  message.attachments[message.attachments.length - 1].actions.forEach((action, index) => {
    const value = JSON.parse(action.value)
    const origIndex = value.response.indexOf(payload.user.id)
    if (origIndex > -1) {
      value.response.splice(origIndex, 1)
    }

    if (index === actionIndex) {
      value.response.push(payload.user.id)
    }

    const responses = value.response.map((a) => `<@${a}>`).join(' ')
    const size = "`" + value.response.length + "`"

    if (value.response.length > 0) {
      message.attachments[index].text = `${responses} ${size}`
    } else {
      delete message.attachments[index].text
    }

    action.value = JSON.stringify(value)
  })

  res.status(200).send(message)
}
