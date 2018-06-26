# reloquent

[![npm version](https://badge.fury.io/js/reloquent.svg)](https://npmjs.org/package/reloquent)

`reloquent` allows to ask users a question, or a series of questions via the read-line interface.

```sh
yarn add -E reloquent
```

- [API](#api)
  * [`Question` Type](#question-type)
    * [<strong><code>text</code></strong>](#text)
    * [<code>validation</code>](#validation)
    * [<code>postProcess</code>](#postprocess)
    * [<code>defaultValue</code>](#defaultvalue)
    * [<code>getDefault</code>](#getdefault)
  * [`async askSingle(question: string, timeout?: number): string`](#async-asksinglequestion-stringtimeout-number-string)
  * [`async askSingle(question: Question, timeout?: number): string`](#async-asksinglequestion-questiontimeout-number-string)
  * [`async ask(questions: <string, Question>, timeout?: number): object`](#async-askquestions-string-questiontimeout-number-object)
- [Them Questions](#them-questions)


## API

There are 3 types of calls to the API:

- ask a single question as a string;
- ask a single question as an object;
- ask multiple questions.

Their respective methods can be required with the `import` statement:

```js
import ask, { askSingle } from 'reloquent'
```

### `Question` Type

When asking a question which is not a string, the `question` object should have the following structure:

<table>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
    <th>Example</th>
  </tr>
  
<tr>
  <td><a name="text"><strong><code>text</code></strong></a></td>

  <td><em>string</em></td>
  <td>Display text. Required.</td>
  <td>

```js
const q = {
  text: 'What is your name',
}
```
  
  </td>
</tr>

<tr>
  <td><a name="validation"><code>validation</code></a></td>

  <td><em>(async) function</em></td>
  <td>A function which needs to throw an error if validation does not pass.</td>
  <td>

```js
const q = {
  text: 'What is your name',
  validate(v) {
    if (!v.length) throw new Error('Name is required.')
  },
}
```
  
  </td>
</tr>

<tr>
  <td><a name="postprocess"><code>postProcess</code></a></td>

  <td><em>(async) function</em></td>
  <td>A function to transform the answer.</td>
  <td>

```js
const q = {
  text: 'What is your name',
  postProcess(v) {
    return `${v.toLowerCase()}`
  },
}
```
  
  </td>
</tr>

<tr>
  <td><a name="defaultvalue"><code>defaultValue</code></a></td>

  <td><em>string</em></td>
  <td>

Default answer (shown to users in `[default]` brackets).</td>
  <td>

```js
const q = {
  text: 'What is your name',
  defaultValue: 'Visitor',
}
```
  
  </td>
</tr>

<tr>
  <td><a name="getdefault"><code>getDefault</code></a></td>

  <td><em>(async) function</em></td>
  <td>A function to execute to obtain the default value.</td>
  <td>

```js
const q = {
  text: 'What is your name',
  async getDefault() {
    await git('config', 'user.name')
  },
}
```
  
  </td>
</tr>
</table>


### `async askSingle(`<br/>&nbsp;&nbsp;`question: string,`<br/>&nbsp;&nbsp;`timeout?: number,`<br/>`): string`

Ask a question as a string and wait for the answer. If a timeout is passed, the promise will expire after the specified number of milliseconds if answer was not given.

```javascript
import { askSingle } from 'reloquent'

(async () => {
  try {
    const answer = await askSingle('What brought you her', 10000)
    console.log(`You've answered: ${answer}`)
  } catch (err) {
    console.log()
    console.log(err)
    console.log('Nevermind...')
  }
})()
```

```fs
What brought you her: I guess Art is the cause.
```

```fs
You've answered: I guess Art is the cause.
```

### `async askSingle(`<br/>&nbsp;&nbsp;`question: Question,`<br/>&nbsp;&nbsp;`timeout?: number,`<br/>`): string`

Ask a question which is passed as an object of the [`Question`](#question-type) type, and return a string.

```javascript
import { askSingle } from 'reloquent'

(async () => {
  const answer = await askSingle({
    text: 'Do you wish me to stay so long?',
    validation(a) {
      if (a.length < 5) {
        throw new Error('The answer is too short')
      }
    },
    defaultValue: 'I desire it much',
    postProcess(a) {
      return `${a}!`
    },
  })
  console.log(answer)
})()
```

```fs
Do you wish me to stay so long? [I desire it much]
```

```fs
I desire it much!
```

### `async ask(`<br/>&nbsp;&nbsp;`questions: <string, Question>,`<br/>&nbsp;&nbsp;`timeout?: number,`<br/>`): object`

Ask a series of questions and transform them into answers.

```javascript
import ask from 'reloquent'

const questions = {
  title: {
    text: 'Title',
    validation: (a) => {
      if (!a) {
        throw new Error('Please enter a title.')
      }
    },
  },
  description: {
    text: 'Description',
    postProcess: s => s.trim(),
    defaultValue: 'A test default value',
  },
  date: {
    text: 'Date',
    async getDefault() {
      await new Promise(r => setTimeout(r, 200))
      return new Date().toLocaleString()
    },
  },
}

;(async () => {
  try {
    const answers = await ask(questions)
    console.log(answers)
  } catch (err) {
    console.log()
    console.log(err)
  }
})()
```

If you provide the following answers (leaving _Date_ as it is):

```fs
Title: hello
Description: [A test default value] world
Date: [2018-6-9 07:11:03]
```

You will get the following object as the result:

```js
{ title: 'hello',
  description: 'world',
  date: '2018-6-9 07:11:03' }
```
## Them Questions

User interaction is important in the modern day applications. `reloquent` is an eloquent way to do this.

[![Why you asking all them questions](http://img.youtube.com/vi/C1pkVrHKDik/0.jpg)](http://www.youtube.com/watch?v=C1pkVrHKDik)

---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
