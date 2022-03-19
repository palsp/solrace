import util from 'util'

export const exec = util.promisify(require('child_process').exec)
