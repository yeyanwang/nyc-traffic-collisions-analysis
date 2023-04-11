# NYC Vehicle Collision WebApp

## Project Description 

Car accidents are a significant public safety concern, resulting in thousands of injuries and fatalities every year. In New York, the problem is particularly severe, with hundreds of thousands of accidents reported annually. This dataset offers a comprehensive view of car accidents in New York, including location, time of day, and number of persons injured.

The project's primary goal is to analyze this data and gain insights into the factors contributing to car accidents, while especially identifying areas where collision frequency is high and more safety measures are needed. The ultimate objective is to establish a more comprehensive understanding of car accidents in New York, promote safer driving practices, and reduce the number of accidents in the city.

## Built with
- Python
- Flask
- SQLite
- HTML
- CSS
- JavaScript
- D3

## Getting Started
**Prerequisites**

Make sure you have installed all of the following prerequisites on your development machine:
- Git 
- Python and set up your virtual environment 
    - pip install flask globally, run the following code in terminal
    
        `pip install flask `
        
- Your favoriate code editor (e.g. VScode, etc.)
- Your favoriate browser (e.g. Google Chrome, Firefox, etc.)


**Installation**
- Clone this repo and save it in your local directory 

    `git clone https://github.com/yeyanwang/nyc-traffic-collisions-analysis.git`

- Open the repo in a code editor 
- Start Flask app by running the following code in command prompt

    `python app.py`
    
- Visit [localhost: 5000](http://localhost:5000/) in your browser


## Implementation Details
This repository provides a collection of scripts and files that demonstrate the project's key features including:

- **ETL.ipynb** 
    - Fetchs February 2023 NYC collision data from New York Open Data API
    - Transformed data retrieved into appropriate formats
    - Load clean data into SQLite database
- **app.py** - A flask app with the following endpoints: 
    - [`/`](http://localhost:5000/)  - Landing page which returns the rendered index.html.
    - [`/data`](http://127.0.0.1:5000/data) - returns NYC Collision data in JSON format
    - [`/boroughs`](http://127.0.0.1:5000/boroughs) - returns NYC borough dataset in GeoJSON format
- **index.html** - Displays page contents and accesses all the libraries being used in the dashboard
- **logic.js** 
    - Creates page contents and allows interactivity
    - Uses d3 to fetch data from data endpoints from `app.py` for the following tasks:
        - Creates map with collisions clusters and borough boundaries
        - Creates Bar chart that displays the boroughs vs. number of collisions
        - Creates Line chart that plots the number of injuries and deaths against the hour of the day
    - Includes functions trigger by event in HTML
- **style.css** - applies styling to the page contents specified in `index.html`

## Contributing 
If you have a suggestion that would make this better, please fork the repo and create a pull request. Thank you!

1. Fork the Project
2. Create your Feature Branch `git checkout -b <your branch>`
3. Commit your Changes `git commit -m '<your message>'`
4. Push to the Branch `git push origin <your branch>`
5. Open a Pull Request

## Credits
- New York Open Data 
- Geological survey data
- D3.js 
- Leaflet.js
- Moment.js
- Plotly.js
