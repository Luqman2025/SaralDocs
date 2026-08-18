# Saral Docs

Saral Docs is a simple full-stack application for analyzing Indian legal documents. It uses a local Legal-BERT risk model in the Python backend and a React UI for document uploads and clause-wise risk analysis.

## Project Structure

```text
SaralDocs/
├── backend/        Flask API, document parser, risk pipeline
├── frontend/       React UI
├── Other/          Old Streamlit/helper files kept as backup
├── start-backend.ps1
├── start-frontend.ps1
└── README.md
```

## Model Download

The trained Legal-BERT risk model is not included in this repository because the model file exceeds GitHub's 100 MB file size limit.

Download the trained model from Google Drive:

**[Download Saral Docs Legal-BERT Model](YOUR_GOOGLE_DRIVE_LINK)**

After downloading, place the model file at:

```text
backend/model/model.safetensors
```

The backend requires this model file to perform clause-level risk classification.

> Make sure the Google Drive file is shared as **Anyone with the link → Viewer** so that users can access it.

## Requirements

Before running the project, make sure you have:

* Python 3.x
* Node.js and npm
* Git

## Run Backend

Open a terminal and run:

```powershell
cd D:\MajorProject\SaralDocs\backend
pip install -r requirements.txt
python app.py
```

The backend runs at:

```text
http://localhost:8000
```

## Run Frontend

Open a second terminal:

```powershell
cd D:\MajorProject\SaralDocs\frontend
npm install
npm start
```

The frontend runs at:

```text
http://localhost:3000
```

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/Luqman2025/SaralDocs.git
cd SaralDocs
```

2. Download the trained model from the Google Drive link above.

3. Place the model at:

```text
backend/model/model.safetensors
```

4. Install the backend dependencies:

```powershell
cd backend
pip install -r requirements.txt
```

5. Start the backend:

```powershell
python app.py
```

6. Open another terminal and start the frontend:

```powershell
cd frontend
npm install
npm start
```

7. Open the application at:

```text
http://localhost:3000
```

## Supported Files

Saral Docs supports:

* PDF
* DOCX
* TXT

Maximum supported file size: **25 MB**

## Features

* Legal document upload
* Document type analysis
* Text extraction
* Clause segmentation
* Clause-wise risk classification
* Low, Medium, and High risk levels
* Overall document risk assessment
* React-based user interface
* Flask-based backend API
* Local Legal-BERT risk model

## Important Note

Saral Docs is an academic AI/ML prototype developed for educational purposes.

The system highlights possible risks in legal documents based on the trained machine learning model. It does **not** provide legal advice and should not be used as a substitute for advice from a qualified legal professional.
