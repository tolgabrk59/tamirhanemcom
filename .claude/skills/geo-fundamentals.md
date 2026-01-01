---
name: geo-fundamentals
description: Generative Engine Optimization for AI search engines (ChatGPT, Claude, Perplexity)
version: 1.0
priority: high
tags: [geo, ai-search, rag, chatgpt, claude, perplexity]
---

# GEO Fundamentals (2025)

## What is GEO?

**GEO** = Generative Engine Optimization
Optimizing content for AI-powered search engines (ChatGPT, Claude, Perplexity, Gemini, Copilot)

```
SEO Goal:  Rank #1 in Google
GEO Goal:  Be cited in AI responses
AEO Goal:  Win featured snippets
```

## Key Concepts

| Concept | Description |
|---------|-------------|
| **RAG** | Retrieval-Augmented Generation - AI retrieves external content |
| **AI Citation** | AI engine references your content as source |
| **Generative Appearance** | Brand appears in AI-generated answers |
| **Share of AI Voice** | Citation frequency vs competitors |

## GEO vs SEO

| Dimension | SEO | GEO |
|-----------|-----|-----|
| Goal | #1 ranking | AI citations |
| Platform | Google, Bing | ChatGPT, Claude, Perplexity |
| Metrics | Rankings, CTR | Citation rate, appearances |
| Content | Keywords, backlinks | Entities, semantics, data |
| Competition | 10 blue links | 5-10 cited sources |
| User Journey | Search → Click → Read | Prompt → AI Answer → (Maybe) Click |

## AI Engine Landscape

| Engine | Citation Style | GEO Opportunity |
|--------|----------------|----------------|
| **ChatGPT** | Inline/footnotes | Custom GPTs |
| **Claude** | Contextual | Long-form favored |
| **Perplexity** | Numbered [1][2] | **HIGH** - Most citations |
| **Gemini** | Sources section | SEO crossover |
| **Copilot** | Learn more links | Enterprise focus |

## RAG Retrieval Factors

```
Stage 2: Retrieval (GEO Critical)
├── Semantic Similarity (40%)
├── Keyword Relevance (20%)
├── Freshness/Recency (10%)
├── Authority (15%)
└── Diversity (15%)
```

## GEO Content Format

```markdown
Optimal Structure for AI Citations:

Title: What is [Topic]? A Complete Guide
├── Summary/TL;DR box (AI loves this)
├── Definition with expert quote
├── Original statistic/data point
├── H2: Key Concepts
│   ├── Clear entity definitions
│   ├── Bullet points for easy extraction
│   └── Table comparing options
├── H2: How [Process] Works
│   └── Step-by-step instructions
├── H2: Statistics/Data
│   └── Original research with source
├── FAQ section (3-5 Q&A)
├── Expert opinions/quotes
├── Author bio with credentials
└── "Last updated: [date]"

Citation Elements:
✅ Statistics with numbers
✅ Expert quotes (name, title)
✅ Original research findings
✅ Clear definitions
✅ Step-by-step processes
✅ Comparison tables
✅ Timestamp for freshness
```

## Schema Markup for GEO

```json
// Essential schemas for AI engines
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "What is GEO?",
      "author": {
        "@type": "Person",
        "name": "Jane Smith",
        "jobTitle": "SEO Strategist",
        "knowsAbout": ["SEO", "GEO", "AI Search"]
      },
      "datePublished": "2025-12-15",
      "dateModified": "2025-12-30"
    },
    {
      "@type": "Organization",
      "name": "Company",
      "sameAs": ["https://linkedin.com/...", "https://twitter.com/..."]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is GEO?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GEO is..."
          }
        }
      ]
    }
  ]
}
```

## GEO Strategy Checklist

```markdown
Content Optimization:
☐ Question-based titles
☐ FAQ sections (3-5 Q&A)
☐ Original statistics/data
☐ Expert quotes with attribution
☐ Author bio with credentials
☐ "Last updated" timestamp
☐ Summary/TL;DR box
☐ Sources and citations

Technical:
☐ Article schema with date
☐ Person schema for authors
☐ Organization schema
☐ FAQPage schema
☐ Clean HTML structure
☐ Semantic heading hierarchy
☐ Fast page speed (< 2.5s)

Entity Building:
☐ Google Knowledge Panel
☐ Wikipedia page (if notable)
☐ Wikidata entries
☐ Consistent NAP across platforms
☐ Social profiles complete
☐ Industry mentions/media coverage

Measurement:
☐ Track AI citations manually
☐ Document "According to [Brand]" mentions
☐ Monitor competitor citations
☐ Calculate Share of AI Voice
☐ Track AI-referred traffic (UTM)
```

## GEO Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **GAS** | Generative Appearance Score | Increasing trend |
| **AI Citation Rate** | Monthly citations | 10-20% MoM growth |
| **Share of AI Voice** | Citations vs competitors | >25% in niche |

## Quick Tips

```
✅ Do:
- Create original research and statistics
- Add expert quotes with names/titles
- Include clear definitions
- Use question-based headings
- Add FAQ sections
- Update content regularly
- Cite authoritative sources

❌ Don't:
- Publish without dates
- Use vague attributions
- Skip schema markup
- Ignore mobile optimization
- Forget author credentials
- Use thin content
```

## robots.txt for AI Crawlers

```
# Allow AI crawlers
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

# Block private areas
User-agent: *
Disallow: /admin/
Disallow: /private/
```

---

**Last Updated:** 2025-12-30
