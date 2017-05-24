const fs = require('fs');
const path = require('path');
const srcDir = `${__dirname}/tutorials`;
const dstDir = `${__dirname}/../tmp/tutorials`;

function markdownCodeBlock(text) {
  return `\`\`\`\n${text}\n\`\`\``;
}

function codeBlockWithLinenums(text) {
  return `<pre class="prettyprint source linenums"><code>${text}</code></pre>`;
}

if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir);

for (const file of fs.readdirSync(srcDir)) {
  let contents = fs.readFileSync(`${srcDir}/${file}`).toString();
  if (path.extname(file).toLowerCase() === '.md') {
    // Look for a custom {@example } marker and replace it with code from the examples folder:
    contents = contents.replace(/\{@example( linenums)? ([^}]+)\}/g, (_, linenums, exampleName) => {
      const example = fs.readFileSync(`${__dirname}/../examples/${exampleName.trim()}.js`).toString();
      return linenums ? codeBlockWithLinenums(example) : markdownCodeBlock(example);
    })
  }
  fs.writeFileSync(`${dstDir}/${file}`, contents);
}
