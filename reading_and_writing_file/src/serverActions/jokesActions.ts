import { createServerFn } from '@tanstack/react-start'
import * as fs from 'node:fs'
import type { JokesData, Joke } from '../types'
import { v4 as uuidv4 } from 'uuid'

const JOKES_FILE = 'src/data/jokes.json'

export const getJokes = createServerFn({ method: 'GET' }).handler(async () => {
  const jokes = await fs.promises.readFile(JOKES_FILE, 'utf-8')
  return JSON.parse(jokes) as JokesData
})

// inputValidatorを使用して受信データが正しい形式であることを検証
// 実際の書き込み処理はhandlerで行う
// ジョークに一意のIDを生成して、データを更新する
export const addJoke = createServerFn({ method: 'POST' })
  .inputValidator((data: { question: string; answer: string }) => {
    // Validate input data
    if (!data.question || !data.question.trim()) {
      throw new Error('Joke question is required')
    }
    if (!data.answer || !data.answer.trim()) {
      throw new Error('Joke answer is required')
    }
    return data
  }).handler(async ({ data }) => {
    try {
      const jokesData = await getJokes()

      const newJoke: Joke = {
        id: uuidv4(),
        question: data.question,
        answer: data.answer,
      }
      const updatedJokesData = [...jokesData, newJoke]

      await fs.promises.writeFile(
        JOKES_FILE,
        JSON.stringify(updatedJokesData, null, 2),
      )

      return newJoke
    } catch (error) {
      console.error('Error adding joke:', error)
      throw new Error('Failed to add joke')
    }
  })
