import { Client } from './client'

const SEC_IDS: string[] = ['F00000PI4A']

const client = new Client()

SEC_IDS.forEach(async id => {
  await client.getDetails(id)
  await client.getCumulativeReturn(id)
})
