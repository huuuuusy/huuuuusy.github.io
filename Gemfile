source "https://rubygems.org"

# Match the dependency set used by GitHub Pages.
gem "github-pages", group: :jekyll_plugins

# Security floors for transitive GitHub Pages dependencies. Keeping these
# explicit prevents an old local Ruby from silently locking vulnerable builds.
gem "activesupport", "~> 8.1"
gem "faraday", ">= 2.14.3", "< 3"
gem "nokogiri", ">= 1.19.4", "< 2"

group :jekyll_plugins do
  gem "jekyll-redirect-from"
  gem "jekyll-sitemap"
end
