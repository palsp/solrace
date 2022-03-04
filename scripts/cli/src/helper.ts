import readline from 'readline'
import fs from 'fs'

export const prompt = (question: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(function (resolve, reject) {
    rl.question(question, function (answer) {
      rl.close()
      resolve(answer.trim())
    })
  })
}
