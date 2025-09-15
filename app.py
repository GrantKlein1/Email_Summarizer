import os
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)  

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    email_text = data.get("email", "")
    email_prompt = data.get("prompt", "")
    prompt = (f"{email_prompt} + {email_text}")
    #Count the words in the email and send that to the model. Then have different ranges of summary lengths based on the word count.
    #word_count = len(email_text.split())
    # prompt = (
    #     " You are an expert email summarizer agent trained to accurately, succinctly and effectively summarize emails."
    #     " Follow these steps exactly for every email you analyze:"
    #     " First I will give you the length of the email in words and you will respond within my specified range of summary lengths based on the word count."
    #     " If the email is less than 50 words, respond with a summary between 10-20 words."
    #     " If the email is between 50-100 words, respond with a summary between 20-40 words."
    #     " If the email is between 100-200 words, respond with a summary between 40-70 words."
    #     " If the email is between 200-500 words, respond with a summary between 70-100 words."
    #     " If the email is over 500 words, respond with a summary between 100-150 words."
    #     f" The email I will provide you is {word_count} words long."
    #     " Analyze the email below and provide a summary."
    # f"EMAIL:\n{email_text}"
    # )

    try:
        print("🔍 Sending request to Groq API...")
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}"
            },
            json={
                "model": "llama3-8b-8192",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3                       #Adjusts the randomness of the response, lower values make it more deterministic
            },
            timeout=5 
        )

        result = response.json()
        
        result_text = result["choices"][0]["message"]["content"]
        errors = ""
        if response.status_code == 503:
            errors = "Internal API server error. Please try again later."
        elif response.status_code == 429:
            errors = "API rate limit exceeded. Please wait 24 hours before trying again."

        return jsonify({"result": result_text, "errors": errors})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

