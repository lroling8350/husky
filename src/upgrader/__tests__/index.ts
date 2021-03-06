import fs from 'fs'
import path from 'path'
import tempy from 'tempy'
import index from '../'

describe('upgrade', (): void => {
  it('should run working command and return 0 status', (): void => {
    const dir = tempy.directory()
    const filename = path.join(dir, 'package.json')

    fs.writeFileSync(
      filename,
      JSON.stringify({
        scripts: {
          commitmsg: 'echo $GIT_PARAMS GIT_PARAMS HUSKY_GIT_PARAMS',
          precommit: 'npm test'
        }
      }),
      'utf-8'
    )

    index(dir)

    expect(JSON.parse(fs.readFileSync(filename, 'utf-8'))).toEqual({
      husky: {
        hooks: {
          'commit-msg':
            'echo $HUSKY_GIT_PARAMS HUSKY_GIT_PARAMS HUSKY_GIT_PARAMS',
          'pre-commit': 'npm test'
        }
      },
      scripts: {}
    })
  })
})
