import os
import requests
import json
import fitz  # PyMuPDF
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS

# --- 1. Basic Flask App Setup ---
app = Flask(__name__)
# Enable CORS for all routes, allowing your React frontend to communicate with this backend.
CORS(app) 

# --- 2. Load Configuration ---
# This is done once when the app starts.
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OR_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError("Error: OR_API_KEY not found in .env file.")

# --- 3. Refactored PDF Reading Function ---
# This function is modified to accept a file stream instead of a file path.
def read_text_from_pdf(file_stream) -> str | None:
    """
    Opens a PDF from an in-memory stream and returns its text content.
    """
    try:
        # fitz.open() can read directly from a stream of bytes
        doc = fitz.open(stream=file_stream, filetype="pdf")
        full_text = "".join(page.get_text() for page in doc)
        doc.close()
        
        if not full_text.strip():
            # This is now an error condition we can return as JSON
            return None
        return full_text
    except Exception as e:
        # Log the server-side error for debugging
        print(f"❌ Error reading PDF stream: {e}")
        return None

# --- 4. The API Endpoint ---
@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz_endpoint():
    """
    API endpoint that receives a PDF file, generates a quiz, and returns it as JSON.
    """
    # --- Check for File in Request ---
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not file or not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

    print(f"✅ Received file: {file.filename}")

    # --- Read Text from Uploaded PDF ---
    # We pass the file's byte stream directly to the function
    document_text = read_text_from_pdf(file_stream=file.read())

    if not document_text:
        return jsonify({"error": "Could not extract text from the PDF. The file might be empty, corrupted, or image-based."}), 400

    # --- Prepare the Prompt (same logic as your script) ---
    text_chunk = " ".join(document_text.split()[:1000])
    prompt = f"""
    You are an expert instructional designer creating a technical assessment. 
    Your task is to generate a JSON array of exactly 20 high-quality, distinct multiple-choice questions based on the provided IT study material.

    **Instructions:**
    1. The output must be ONLY a valid JSON array. Do not include any other text, explanations, or markdown formatting like ```json.
    2. Each object in the JSON array must have the following keys: "id", "question", "options" (an array of 4 strings), "answer", "difficulty" (a float from 0.0 to 1.0), and "justification".
    3. You must determine the "difficulty" score based on these criteria:
        - **Conceptual Depth:** Simple recall of facts is low difficulty (0.1-0.3), while questions requiring synthesis of multiple concepts are high difficulty (0.8-1.0).
        - **Lexical Complexity:** Use of common terms is low difficulty, while use of specialized technical jargon is high difficulty.
    4. The "justification" string must briefly explain your reasoning for the assigned difficulty score.

    Here is the study material text:
    ---
    {text_chunk}
    ---
    """

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": "openai/gpt-oss-20b:free",
        "messages": [{"role": "user", "content": prompt}],
    }

    print("\n--- Sending prompt to AI... ---")
    
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            data=json.dumps(data)
        )
        response.raise_for_status() # Raises an HTTPError for bad responses (4xx or 5xx)

        ai_response_json = response.json()
        content_string = ai_response_json['choices'][0]['message']['content']
        
        # The AI should return a clean JSON string, which we now parse
        final_quiz = json.loads(content_string)
        
        print("✅ --- Quiz Generated Successfully ---")
        return jsonify(final_quiz), 200 # Return the quiz as a JSON response

    except requests.exceptions.HTTPError as http_err:
        print(f"❌ HTTP error occurred: {http_err}")
        print(f"Raw Response: {response.text}")
        return jsonify({"error": "Failed to communicate with the AI service.", "details": response.text}), 502 # 502 Bad Gateway
    except json.JSONDecodeError:
        print(f"❌ Failed to parse JSON from AI response.")
        print(f"Raw Response: {content_string}")
        return jsonify({"error": "Invalid response format from the AI service.", "details": content_string}), 500
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
        return jsonify({"error": "An internal server error occurred.", "details": str(e)}), 500

# --- 5. Run the Flask App ---
if __name__ == '__main__':
    # Runs the app on [http://127.0.0.1:5000](http://127.0.0.1:5000)
    # The debug=True flag allows for auto-reloading when you save changes.
    app.run(debug=True, port=5000)