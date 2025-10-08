#!/usr/bin/env python3
"""
Refactor guide HTML files to use idiomatic Tailwind CSS patterns.
Replaces CSS custom properties with JIT config and @layer organization.
"""

import re
import sys

# The idiomatic Tailwind style block template
TAILWIND_STYLE_TEMPLATE = '''  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    // Idiomatic Tailwind JIT Configuration
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'neon-surge': '#43CC50',
            'steel-glow': '#5B6E6E',
            'pale-alloy': '#B8B8B8',
            'primary-green': '#04703C',
            'ember-spark': '#C27329',
            'arc-weld-blue': '#2DB2C4',
          }
        }
      }
    }
  </script>
  <style type="text/tailwindcss">
    @layer components {
      .section-container {
        @apply p-6 rounded-lg border border-slate-800 bg-slate-900/40;
      }
      
      .section-title {
        @apply text-xl font-bold mb-4 text-neon-surge;
      }
      
      .subsection-title {
        @apply text-lg font-semibold mb-2 text-neon-surge;
      }
      
      .command-code {
        @apply bg-slate-800 px-1 rounded text-sm font-mono text-slate-200;
      }
      
      .code-block {
        @apply bg-slate-800 p-2 rounded text-xs font-mono text-slate-200 overflow-x-auto;
      }
      
      .emphasis-text {
        @apply font-semibold text-ember-spark;
      }
      
      .table-header {
        @apply text-left p-3 font-semibold text-neon-surge;
      }
      
      .table-cell {
        @apply p-3;
      }
      
      .command-cell {
        @apply font-mono font-semibold text-emerald-400;
      }
      
      .table-row {
        @apply border-b border-slate-800;
      }
      
      .qr-code-container {
        @apply flex-shrink-0;
      }
      
      .qr-code-container canvas {
        @apply transition-transform duration-200 hover:scale-105;
      }
    }
    
    @layer base {
      :root {
        @apply dark;
      }
      
      body {
        @apply bg-slate-900 text-slate-200;
      }
    }
  </style>'''

def refactor_guide(filename):
    """Refactor a single guide file."""
    print(f"📝 Refactoring: {filename}")
    
    with open(filename, 'r') as f:
        content = f.read()
    
    # Pattern to match from <script src="tailwind"> to </style>
    pattern = r'(<script src="https://cdn\.tailwindcss\.com"></script>\s*<style>.*?</style>)'
    
    # Replace with idiomatic template
    content = re.sub(pattern, TAILWIND_STYLE_TEMPLATE, content, flags=re.DOTALL)
    
    with open(filename, 'w') as f:
        f.write(content)
    
    print(f"✅ Completed: {filename}")

def main():
    files = [
        'guides/linux-cheatsheet-3.html',
        'guides/linux-cheatsheet-4.html',
        'guides/linux-day-1-setup-tips.html',
    ]
    
    for file in files:
        try:
            refactor_guide(file)
        except Exception as e:
            print(f"❌ Error processing {file}: {e}", file=sys.stderr)
            continue
    
    print("🎉 All guides refactored!")

if __name__ == '__main__':
    main()

