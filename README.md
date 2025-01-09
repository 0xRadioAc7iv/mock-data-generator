# Mock Data Generator

**Mock Data Generator** is a tool designed to help backend developers quickly populate databases with realistic mock data during development. It allows you to provide a database schema and generates randomized, real-world data that aligns with your schema's field types and constraints.

## Features

- Generates realistic, randomized data based on your schema.
- Supports different field types such as strings, integers, booleans, dates, and more.
- Customizable to match schema constraints like length, uniqueness, and formats (e.g., email, date).
- Option to export generated data in JSON, CSV, or SQL insert formats.
- Option to generate large volumes of data with control over the number of records.
- Seeding directly into popular databases (e.g., PostgreSQL, MySQL) via integrations.

## Setup

#### 1. Clone the repo

```bash
git clone https://github.com/0xRadioAc7iv/mock-data-generator.git
```

#### 2. `cd` into the repo

```bash
cd mock-data-generator
```

#### 3. Activate & Install

```bash
source venv/Scripts/activate
pip -r requirements.txt
```

#### 4. Run Server

```bash
fastapi dev app/main.py
```
