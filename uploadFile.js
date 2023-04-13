/* uploadFile.js */
import fs from 'fs';

import { openai } from './api.js';

async function upload() {
  try {
    const response = await openai.createFile(
      fs.createReadStream('./dataset/data_prepared.jsonl'),
      "fine-tune"
    );
    console.log('File ID: ', response.data.id)
  } catch (err) {
    console.log('err: ', err)
  }
}

upload()