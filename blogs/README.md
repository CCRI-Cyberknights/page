# Blogs Directory

This directory contains blog posts and articles for the CCRI Cyberknights club, following the unified content management system with JSON metadata for seamless SPA integration and consistent Cyberknights styling with visual differentiation in the resources grid.

## Blog Post Structure

### File Naming Convention
- Use kebab-case for filenames (e.g., `microsoft-aws-ai-opportunities.html`)
- Include descriptive names that reflect the content
- Use `.html` extension for consistency with guides

### Content Structure
Each blog post should follow this structure:
- **Standalone HTML**: Complete HTML document that works independently
- **Cyberknights Styling**: Uses official Cyberknights color palette (`--neon-surge`, `--ember-spark`, `--arc-weld-blue`) and DRY CSS classes (`.section-container`, `.section-title`, `.emphasis-text`)
- **Unified Design**: Consistent visual hierarchy matching Linux guides for seamless brand consistency
- **Metadata**: Title, date, author, category, and tags
- **Responsive Design**: Mobile-friendly layout

## Integration with Main Application

### Blog Index System
Blog posts are indexed in `blogs/blog-posts.json` which contains:
- **Metadata**: Title, date, author, category, summary
- **File Reference**: Points to the actual HTML file in this directory
- **Tags**: For categorization and filtering
- **Slug**: URL-friendly identifier
- **Unified Schema**: Identical structure to `guides/guides.json` for consistent management

### Routing Integration
Blog posts are accessible via:
- **SPA Route**: `#/blogs/filename.html` (e.g., `#/blogs/microsoft-aws-ai-opportunities.html`)
- **Standalone**: Direct file access at `/blogs/filename.html`
- **Blog Index**: Listed on the main blog page (`#/blog`)

### Resources Integration
Blog posts are automatically integrated into the Resources page through the unified content management system. They appear with warm amber hover accents (`hover:border-amber-500`) to differentiate them from guides (which use cool blue accents). No manual addition to resources array is needed.

## Content Guidelines

### Writing Style
- **Professional Tone**: Maintain academic and professional language
- **Actionable Content**: Include specific steps, links, and resources
- **Club Focus**: Relate content to club activities and member benefits
- **Technical Accuracy**: Ensure all technical information is correct and up-to-date

### Content Types
- **Career Opportunities**: Job postings, certification opportunities, networking events
- **Meeting Recaps**: Summaries of club meetings and key takeaways
- **Member Achievements**: Spotlighting member accomplishments
- **Competition Results**: CTF results, competition highlights
- **Club Announcements**: Important updates and news
- **Educational Content**: Technical tutorials and learning resources

### Metadata Requirements
Each blog post must include:
- **Title**: Clear, descriptive headline
- **Date**: Publication date in YYYY-MM-DD format
- **Author**: Full name of the author
- **Category**: One of: career, technical, club, competition, announcement
- **Tags**: Relevant keywords for categorization
- **Summary**: Brief description for the blog index

## File Management

### Adding New Blog Posts
1. **Create HTML File**: Use existing blog post as template with Cyberknights styling
2. **Update Index**: Add entry to `blogs/blog-posts.json` with unified schema
3. **Test Integration**: Verify SPA routing and blog index display
4. **Automatic Resources**: Blog posts automatically appear in Resources page with amber accents

### Updating Existing Posts
1. **Edit HTML File**: Make changes directly to the HTML file
2. **Update Metadata**: Modify entry in `blogs/blog-posts.json` if needed
3. **Test Changes**: Verify updates appear correctly

### File Organization
- **Chronological**: Consider date-based organization for easy management
- **Categorization**: Group related posts by topic or event
- **Naming**: Use consistent, descriptive filenames

## Technical Implementation

### HTML Template Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Blog Post Title - CCRI Cyberknights</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="../js/qrcode.min.js"></script>
    <script src="../js/qr-code-manager.js"></script>
    <style>
        :root { color-scheme: dark; }
        body { background: #0f172a; color: #e2e8f0; }
        
        /* Official Cyberknights Color Palette */
        :root {
          --neon-surge: #43CC50;
          --steel-glow: #5B6E6E;
          --pale-alloy: #B8B8B8;
          --primary-green: #04703C;
          --ember-spark: #C27329;
          --arc-weld-blue: #2DB2C4;
        }
        
        /* DRY Reusable Classes */
        .section-container {
          @apply p-6 rounded-lg border border-slate-800 bg-slate-900/40;
        }
        
        .section-title {
          @apply text-xl font-bold mb-4;
          color: var(--neon-surge);
        }
        
        .subsection-title {
          @apply text-lg font-semibold mb-2;
          color: var(--neon-surge);
        }
        
        .emphasis-text {
          color: var(--ember-spark);
        }
    </style>
</head>
<body class="bg-slate-900 text-slate-200 min-h-screen">
    <div class="max-w-4xl mx-auto p-6 space-y-8">
        <!-- Header with centered title -->
        <!-- Section containers with content -->
        <!-- Tags section -->
    </div>
</body>
</html>
```

### Styling Guidelines
- **Color Scheme**: Use official Cyberknights color palette (`--neon-surge`, `--ember-spark`, `--arc-weld-blue`)
- **Typography**: Use DRY CSS classes (`.section-title`, `.subsection-title`, `.emphasis-text`)
- **Layout**: Use `.section-container` for consistent card-based layout
- **Responsive**: Ensure mobile-friendly design
- **Accessibility**: Include proper heading hierarchy and alt text

### Navigation Integration
- **Back Links**: Include "Back to Blog" links for SPA navigation
- **Breadcrumbs**: Consider adding breadcrumb navigation for complex posts
- **Related Posts**: Link to related content when appropriate

## Workflow for New Blog Posts

### Step 1: Content Planning
1. **Identify Topic**: Choose relevant, valuable content for club members
2. **Gather Information**: Collect all necessary details, links, and resources
3. **Outline Structure**: Plan the article flow and key points
4. **Determine Metadata**: Set title, category, tags, and summary

### Step 2: File Creation
1. **Copy Template**: Use existing blog post as starting point
2. **Update Metadata**: Change title, date, author, and other details
3. **Write Content**: Create the main article content
4. **Apply Styling**: Ensure consistent formatting and design

### Step 3: Integration
1. **Update Index**: Add entry to `blogs/blog-posts.json` with unified schema
2. **Test SPA Route**: Verify `#/blogs/filename.html` works
3. **Test Blog Index**: Confirm post appears on main blog page
4. **Automatic Resources**: Verify post appears in Resources page with amber accents

### Step 4: Review and Publish
1. **Content Review**: Check for accuracy and completeness
2. **Technical Testing**: Verify all links and functionality
3. **Mobile Testing**: Ensure responsive design works
4. **Final Check**: Confirm integration with main application

## Best Practices

### Content Quality
- **Accuracy**: Verify all technical information and links
- **Relevance**: Ensure content is valuable to club members
- **Timeliness**: Publish content while it's still relevant
- **Completeness**: Include all necessary information and resources

### Technical Quality
- **Standalone Functionality**: Each post should work independently
- **SPA Integration**: Ensure proper integration with main application
- **Performance**: Optimize for fast loading and minimal bandwidth
- **Accessibility**: Follow web accessibility guidelines

### Maintenance
- **Regular Updates**: Keep content current and relevant
- **Link Checking**: Verify external links remain functional
- **Archive Management**: Consider archiving outdated content
- **Version Control**: Track changes and updates

## Examples

### Current Blog Posts
- **microsoft-aws-ai-opportunities.html**: Career opportunities from RIC meetup
- Additional posts can be added following the same pattern

### Template Usage
Use `microsoft-aws-ai-opportunities.html` as a template for new blog posts, updating:
- Title and metadata
- Main content
- Tags and categories
- Links and resources

This approach ensures consistency while maintaining the flexibility to create diverse, valuable content for the CCRI Cyberknights club.
