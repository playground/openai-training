# OpenAI Training

Train custom data with OpenAI API  

## Pre-requisites

* On macOS, install [Homebrew](https://brew.sh/)
* Install `make` and `gcc`
  - On maacOS, `brew install make` and `brew install gcc`
  - On Ubuntu, `apt-get -y install make gcc`
* Install [node](https://nodejs.org/en) and npm
  - On macOS, `brew install node`
  - On Ubuntu, `sudo apt-get -y install node`
* Install [openai tools](https://platform.openai.com/docs/api-reference) `npm install openai`

**NOTE**: If you will have more than one version of NodeJS running on your machine, consider using a Node version manager solution.

## Quickstart

* **FIRST TIME ONLY** Set your OpenAI key with `export OPENAI_KEY=[put key here]`
* **FIRST TIME ONLY** Initialize and install pre-reqs and run one-time commands: `make init`
* **OPTIONAL** Set your input prompt filename if you do not wish to use the default value of "dataset/data.jsonl":
  - `export INPUT_PROMPTS_FILENAME="dataset/data.jsonl"`
* **OPTIONAL** Set your output prompt filename if you do not wish to use the default value of "dataset/mydata.jsonl":
  - `export OUTPUT_PROMPTS_FILENAME="dataset/mydata.jsonl"`
* Format the input data and train the model: `make train`

## Manual steps for training

* Copy env-template.json to .env-local.json and fill in your [OpenAI API Key](https://platform.openai.com/), if you don't already have one, login to your OpenAI account, select your profile icon in the top right, and select "view API keys" to use an existing key or create a new one.
* Create JSONL file under dataset directory with your custom Prompts and Completions, see dataset/data.jsonl as an example.  From the root repository folder:
* Run ```NAME=dataset/data.jsonl npm run do:format-data``` to format your dataset
* Run ```npm run do:upload --name=mydata.jsonl``` to upload your dataset 
* Run ```npm run do:fine-tune --file_id=file-[ex. Evd3NT11somethinglikethis]``` obtain the File ID from upload
* Run ```npm run do:list``` once the training is completed, you should get ```fine_tuned_model: 'davinci:ft-personal-2023-04-12-00-14-43'``` 
* Run ```npm run do:completion --model=davinci:ft-personal-2023-04-12-00-14-43 --prompt="what are the benefits of ibm edge computing"``` to test the model                             