# inquire

[![Coverage Status](https://coveralls.io/repos/github/exbotanical/inquire/badge.svg?branch=master)](https://coveralls.io/github/exbotanical/inquire?branch=master)
[![Continuous Deployment](https://github.com/exbotanical/inquire/actions/workflows/cd.yml/badge.svg)](https://github.com/exbotanical/inquire/actions/workflows/cd.yml)
[![Continuous Integration](https://github.com/exbotanical/inquire/actions/workflows/ci.yml/badge.svg)](https://github.com/exbotanical/inquire/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/inquire.svg)](https://badge.fury.io/js/inquire)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```ts
interface LargeConfig {
  id: string
  name: string
  timestamp: number
  owner: {
    teamName: string
    email: string
  }
  configs: { id: string; type: string }[]
  numbers: number[]
  unit: number
}

const configs: LargeConfig[] = [ ... ]

const result = new View(configs)
  .get()
  .where('timestamp', { lt: Date.now() })
  .and()
  .where('configs', {
    contains: {
      id: 'node',
      type: 'runtime',
    },
  })
  .run()

result.length // 2
result[0] // configs[0]
result[1] // configs[2]
```


## Table of Contents

- [Install](#install)
  - [Supported Environments](#support)
- [Documentation](#docs)

## <a name="install"></a> Installation

```bash
npm install inquire
```

### <a name="support"></a> Supported Environments

`inquire` currently supports UMD, CommonJS (node versions >= 10), and ESM build-targets

## <a name="docs"></a> Documentation

Full documentation can be found [here](https://exbotanical.github.io/inquire/inquire.html)
