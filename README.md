![Regeni Header](docs/Regeni%20Header.png)

# Regeni

[![GitHub stars](https://img.shields.io/github/stars/kangise/regeni?style=social)](https://github.com/kangise/regeni/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/kangise/regeni?style=social)](https://github.com/kangise/regeni/network/members)
[![GitHub contributors](https://img.shields.io/github/contributors/kangise/regeni)](https://github.com/kangise/regeni/graphs/contributors)
[![GitHub issues](https://img.shields.io/github/issues/kangise/regeni)](https://github.com/kangise/regeni/issues)
[![GitHub license](https://img.shields.io/github/license/kangise/regeni)](https://github.com/kangise/regeni/blob/main/LICENSE.md)

AI-powered customer intelligence engine that transforms product reviews into actionable business insights.

## Overview

Regeni is an advanced GenAI platform that processes customer review data to generate comprehensive business intelligence across product improvement, innovation opportunities, and marketing positioning strategies.

## Features

- **9-Stage AI Analysis Pipeline**: Comprehensive analysis from product classification to competitive intelligence
- **Multi-language Support**: Native processing for English and Chinese markets
- **Real-time Processing**: Complete analysis in under 5 minutes
- **Enterprise Integration**: Amazon Q CLI integration with scalable data processing
- **Interactive Dashboard**: Professional web interface for insight visualization

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Amazon Q CLI access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kangise/regeni.git
cd regeni
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd front
npm install
```

### Usage

### Usage

#### Option 1: Terminal Mode

1. Prepare your data:
```bash
python3 preprocess_data.py "data/Customer Reviews.csv" "data/Competitor Reviews.csv"
```

2. Run analysis:
```bash
python3 run_analysis.py
```

3. Start the application:
```bash
# Start backend server (Terminal 1)
python3 api_server.py

# Start frontend (Terminal 2)
cd front && npm run dev
```

4. Open http://localhost:3000 in your browser

#### Option 2: Q CLI Mode

If you're using Amazon Q CLI, run these commands in the Q chat:

```bash
# Start backend server in background
nohup python3 api_server.py > backend.log 2>&1 &

# Start frontend in background  
cd front && nohup npm run dev > frontend.log 2>&1 &

# Check if services are running
curl http://localhost:8000/reports  # Backend health check
curl http://localhost:3000          # Frontend health check
```

To stop the services:
```bash
pkill -f api_server.py && pkill -f "npm run dev"
```

1. Prepare your data:
```bash
python3 preprocess_data.py "data/Customer Reviews.csv" "data/Competitor Reviews.csv"
```

2. Run analysis:
```bash
python3 run_analysis.py
```

3. Start the application:
```bash
# Backend
python3 api_server.py

# Frontend (in another terminal)
cd front && npm run dev
```

4. Open http://localhost:3000 in your browser

## Architecture

### Analysis Pipeline

The system processes reviews through 9 specialized AI agents:

1. **Product Classification** - Categorizes products using NLP
2. **Consumer Profiling** - Creates detailed buyer personas
3. **Scenario Mapping** - Identifies key use cases
4. **Motivation Analysis** - Uncovers purchase drivers
5. **Love Point Detection** - Extracts customer value points
6. **Gap Analysis** - Identifies unmet needs
7. **Opportunity Mining** - Generates three-dimensional insights
8. **Sentiment Analysis** - Explains rating patterns
9. **Competitive Intelligence** - Benchmarks against competitors

### Technology Stack

- **Backend**: Python, Flask, Amazon Q CLI
- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Processing**: Custom prompt engineering with context optimization
- **Data Processing**: Pandas, intelligent JSON extraction

## Project Structure

```
regeni/
├── agent/                  # AI agent prompts
├── data/                   # Input data and preprocessing
├── front/                  # React frontend application
├── results/                # Analysis outputs
├── api_server.py          # Backend API server
├── review_analyzer.py     # Core analysis engine
├── run_analysis.py        # Analysis pipeline runner
└── preprocess_data.py     # Data preprocessing utilities
```

## Configuration

The system can be configured through environment variables or configuration files:

- `OUTPUT_LANGUAGE`: Analysis output language (en/zh)
- `CONTEXT_WINDOW_SIZE`: Maximum context size for AI processing
- `API_PORT`: Backend server port (default: 8000)

## API Reference

### Endpoints

- `GET /reports` - List historical analysis reports
- `GET /report/{id}` - Get specific analysis report
- `POST /analyze` - Start new analysis
- `DELETE /reports/{id}` - Delete analysis report

### Response Format

All API responses follow a consistent JSON structure with proper error handling and status codes.

## Development

### Running Tests

```bash
python3 test_pipeline.py
python3 validate_prompts.py
```

### Code Style

This project follows PEP 8 for Python code and Prettier for TypeScript/JavaScript.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

- Documentation: [Wiki](https://github.com/kangise/regeni/wiki)
- Issues: [GitHub Issues](https://github.com/kangise/regeni/issues)
- Discussions: [GitHub Discussions](https://github.com/kangise/regeni/discussions)

## Acknowledgments

Built for the WWGS 2025 GenAI Shark Tank competition. Special thanks to the Amazon Q team for enterprise AI capabilities.
