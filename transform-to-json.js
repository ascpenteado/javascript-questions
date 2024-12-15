const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'README.md'); // Path to the input markdown file
const outputFilePath = path.join(__dirname, 'questions.json'); // Path to the output JSON file

function parseMarkdownToJson(markdown) {
  const questions = [];

  const questionRegex =
    /###### (\d+\.\s+(.+?))\n\n```javascript\n([\s\S]*?)```\n\n((?:- .+\n)+)\n<details><summary><b>Answer<\/b><\/summary>\n<p>\n\n#### Answer: (\w)\n\n([\s\S]*?)<\/p>/g;

  let match;
  let id = 1; // Initialize ID counter

  while ((match = questionRegex.exec(markdown)) !== null) {
    const [, , titleText, code, options, answer, explanation] = match;

    const formattedOptions = options
      .split('\n')
      .filter(Boolean)
      .map((option) => option.replace(/^- /, ''));

    questions.push({
      id: id++, // Add unique ID to each question
      title: titleText, // Use only the text part of the title
      code,
      options: formattedOptions,
      answer,
      explanation: explanation.trim(),
    });
  }

  return questions;
}

function main() {
  try {
    const markdownContent = fs.readFileSync(inputFilePath, 'utf-8');
    const questions = parseMarkdownToJson(markdownContent);
    fs.writeFileSync(outputFilePath, JSON.stringify(questions, null, 2));
    console.log(
      `Successfully converted markdown to JSON. Output file: ${outputFilePath}`
    );
  } catch (error) {
    console.error('Error processing markdown file:', error);
  }
}

main();
