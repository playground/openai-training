# OpenAI Training

Train custom data with OpenAI API  

# Training instructions:
* Copy env-template.json to .env-local.json and fill in your openAI API Key, if you don't already have one, you can create one here https://platform.openai.com/
* Create JSONL file under dataset directory with your custom Prompts and Completions, see dataset/data.jsonl as an example
* Run ```$NAME=dataset/yourdata.jsonl npm do:format-data``` to format your dataset
* Run ```npm run do:upload --name=yourdata.jsonl``` to upload your dataset 
* Run ```npm run do:fine-tune --file_id=file-Evd3NT11somethinglikethis``` obtain the File ID from upload
* Run ```npm run do:list``` once the training is completed, you should get ```fine_tuned_model: 'davinci:ft-personal-2023-04-12-00-14-43'``` 
* Run ```npm run do:completion --model=davinci:ft-personal-2023-04-12-00-14-43 --prompt="what are the benefits of ibm edge computing"``` to test the model                             