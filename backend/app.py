from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY not found in environment variables!")
    print("Please create a .env file with: GEMINI_API_KEY=your_api_key_here")
else:
    genai.configure(api_key=api_key)

model = None
if api_key:
    try:
      
        model = genai.GenerativeModel('gemini-2.5-flash')
        print("Model initialized successfully: gemini-2.5-flash")
    except Exception as e:
        print(f"Error initializing model: {str(e)}")
        
        try:
            model = genai.GenerativeModel('gemini-2.5-pro')
            print("Model initialized successfully: gemini-2.5-pro")
        except Exception as e2:
            print(f"Error initializing fallback model: {str(e2)}")

@app.route("/explain", methods=["POST"])
def explain_code():
    data = request.json
    code = data.get("code", "")

    if not code:
        return jsonify({"error": "No code provided"}), 400

    prompt = f"""
    Explain the following code clearly:
    1. What the code does
    2. Key logic
    3. Time and space complexity
    4. Possible improvements

    Code:
    {code}
    """

    try:
        if not api_key or not model:
            return jsonify({"error": "GEMINI_API_KEY is not configured. Please create a .env file in the backend directory with: GEMINI_API_KEY=your_api_key_here"}), 500
        
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error generating content: {str(e)}")
        return jsonify({"error": f"Failed to generate explanation: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
