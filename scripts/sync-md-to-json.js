const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'editorial');
const JSON_FILE = path.join(__dirname, '..', 'data', 'editorial-articles.json');

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays
      if (value.startsWith('[')) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch (e) {
          // Keep as string if parse fails
        }
      }
      
      frontmatter[key] = value;
    }
  }
  
  return { frontmatter, body: match[2] };
}

// Convert markdown body to content blocks
function bodyToContent(body, frontmatter) {
  const content = [];
  const lines = body.split('\n');
  let currentParagraph = [];
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Flush paragraph
      if (currentParagraph.length > 0) {
        content.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      content.push({ type: 'heading', text: line.slice(3).trim() });
    } else if (line.startsWith('- **')) {
      // List item - collect them
      if (currentParagraph.length > 0) {
        content.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      // Find or create list
      const lastContent = content[content.length - 1];
      if (lastContent && lastContent.type === 'list') {
        lastContent.items.push(line.slice(2).trim());
      } else {
        content.push({ type: 'list', items: [line.slice(2).trim()] });
      }
    } else if (line.trim() === '') {
      // Flush paragraph on empty line
      if (currentParagraph.length > 0) {
        content.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
    } else {
      currentParagraph.push(line.trim());
    }
  }
  
  // Flush remaining
  if (currentParagraph.length > 0) {
    content.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
  }
  
  // Filter out empty content
  return content.filter(c => {
    if (c.type === 'paragraph') return c.text.length > 0;
    if (c.type === 'list') return c.items.length > 0;
    return true;
  });
}

// Main sync
function sync() {
  // Read existing JSON
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  } catch (e) {
    console.log('Starting with empty JSON');
  }
  
  const existingSlugs = new Set(existing.map(a => a.slug));
  
  // Read all .md files
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} markdown files`);
  
  let added = 0;
  
  for (const file of files) {
    const slug = file.replace('.md', '');
    
    if (existingSlugs.has(slug)) {
      continue; // Already in JSON
    }
    
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = parseFrontmatter(content);
    
    if (!parsed) {
      console.log(`Skipping ${file} - no frontmatter`);
      continue;
    }
    
    const { frontmatter, body } = parsed;
    
    // Convert to article format
    const article = {
      id: slug,
      slug: slug,
      title: frontmatter.title || slug,
      subtitle: frontmatter.subtitle || '',
      category: frontmatter.category || 'Local Guide',
      author: frontmatter.author || 'Slough.co',
      publishedAt: frontmatter.publishedAt || new Date().toISOString(),
      heroImage: frontmatter.heroImage || '/images/editorial/default.jpg',
      excerpt: frontmatter.excerpt || '',
      content: bodyToContent(body, frontmatter),
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      readTime: 3,
      featured: frontmatter.featured === 'true' || frontmatter.featured === true
    };
    
    existing.push(article);
    added++;
    console.log(`Added: ${slug}`);
  }
  
  // Write back
  fs.writeFileSync(JSON_FILE, JSON.stringify(existing, null, 2));
  console.log(`\nDone! Added ${added} new articles. Total: ${existing.length}`);
}

sync();
