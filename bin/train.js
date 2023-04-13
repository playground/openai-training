#! /usr/bin/env node
import cp from 'child_process';
import { createReadStream, existsSync, readFileSync } from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import { Observable } from 'rxjs';

let envar;

console.log(process.cwd())
if(existsSync('.env-local.json')) {
  envar = JSON.parse(readFileSync('.env-local.json').toString());
}

const exec = cp.exec;
const openaiApiKey = envar.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: envar.OPENAI_API_KEY
});
console.log(openaiApiKey, envar.OPENAI_API_KEY)

console.log(configuration)
const openai = new OpenAIApi(configuration);

const name = process.env.npm_config_name;
const fileId = process.env.npm_config_file_id;
const model = process.env.npm_config_model;
const platform = process.env.npm_config_platform || 'amd64';
const task = process.env.npm_config_task;
const prompt = process.env.npm_config_prompt || 'what is edge computing';

if(!task) {
  console.log(`specify --task taskname...`)
  process.exit(0)
}
if(task == 'upload' && !name) {
  console.log(`specify --name filename...`)
  process.exit(0)
} else if(task == 'fineTuneModel' && !fileId) {
  console.log(`specify --file_id fileid...`)
  process.exit(0)
} else if(task == 'createCompletion' && !model) {
  console.log(`specify --model davinci:ft-personal-2023-04-12-00-14-43...`)
  process.exit(0)
}
if(!configuration.apiKey) {
  console.log('OpenAI API key is not configured');
  process.exit(0)
}
let train = {
  upload: async () => {
    try {
      const filename = name.replace('.jsonl', '')
      const response = await openai.createFile(
        createReadStream(`./dataset/${filename}_prepared.jsonl`),
        "fine-tune"
      );
      console.log('File ID: ', response.data.id)
    } catch (err) {
      console.log('err: ', err)
    }
  },
  formatJsonL: () => {
    const arg = `openai tools fine_tunes.prepare_data -f ${name}`
    train.shell(arg,`done formatting ${name}`, `failed to format ${name}`, false)
    .subscribe({
      complete: () => process.exit(0),
      error: (err) => {
        console.log(err)
        process.exit(0)
      }
    })    
  },
  fineTuneModel: async () => {
    try {
      const response = await openai.createFineTune({
        training_file: fileId,
        model: 'davinci'
      })
      console.log('response: ', response)
    } catch (err) {
      console.log('error: ', err.response.data.error)
    }
  },
  listFineTuneModel: async () => {
    try {
      const response = await openai.listFineTunes()
      console.log('data: ', response.data.data)
    } catch (err) {
      console.log('error:', err)
    }
  },
  createCompletion: async () => {
    try {
      const response = await openai.createCompletion({
        model: model,
        prompt: prompt,
        max_tokens: 200
      })
      if (response.data) {
        console.log('choices: ', response.data.choices)
      }
    } catch (err) {
      console.log('err: ', err)
    }
  },
  shell: (arg, success='command executed successfully', error='command failed', prnStdout=true, options={maxBuffer: 1024 * 2000}) => {
    return new Observable((observer) => {
      console.log(arg);
      let child = exec(arg, options, (err, stdout, stderr) => {
        if(!err) {
          // console.log(stdout);
          console.log(success);
          observer.next(prnStdout ? stdout : '');
          observer.complete();
        } else {
          console.log(`${error}: ${err}`);
          observer.error(err);
        }
      });
      child.stdout.pipe(process.stdout);
      child.on('data', (data) => {
        console.log(data)
      })  
    });  
  }
}

train[task]();