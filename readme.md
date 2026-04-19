# 📺 CYF TV Shows & Episodes Guide

A vanilla JavaScript web app that pulls live data from the TVMaze API and presents it in a clean, searchable interface — built as part of the CodeYourFuture Data Flows module.

## 🔗 Website Link

[LIVE SITE](https://cyf-eugenie-a-tv.netlify.app/)

## What does it do?

Users can browse a full catalogue of TV shows pulled directly from the TVMaze API, pick a show, and explore its episodes — all without a single page reload.
The app has two main modes:

- Show directory — an alphabetically sorted, searchable list of thousands of TV shows. Filter in real time by name, genre, or summary.
- Episode viewer — once a show is selected, its episodes load into a card grid. A search bar and dropdown let you zero in on any specific episode instantly.

## How it's built

| Technology | How it's used |
|---|---|
| HTML5 | Semantic markup for screen-reader accessibility |
| CSS3 | Grid + Flexbox layout, custom properties, fully responsive |
| JavaScript ES6+ | `fetch`, `async/await`, DOM manipulation, event handling |
| TVMaze API | Source of all show data, episode info, and images |

Episode data is cached after the first fetch, so switching between shows doesn't hammer the network.

## What I learned
- Reading and working with an existing codebase written by someone else
- Fetching and rendering JSON data from the TVMaze API asynchronously
- Keeping the UI responsive to user input without page refreshes through live search and dropdown filtering
- Caching fetched data so no URL is requested more than once per session
- Building and switching between multiple views without a page reload
- Pair programming via a shared GitHub repo, alternating ownership of the codebase each level

## Project structure
```
Project-TV-Show/
├── index.html
├── style.css
└── script.js
```

## Built by

| Role | Name | GitHub |
|---|---|---|
| Author | Eugenie Ahangama | [@Eugenie-A](https://github.com/Eugenie-A) |
| Partner | Shuheda | [@codebyshay](https://github.com/codebyshay) |
| Partner's repo | Project-TV-Show-Partner | [Link](https://github.com/Eugenie-A/Project-TV-Show-Partner) |
