---
permalink: /
title: "About Me"
# excerpt: "Shiyu Hu"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<section class="home-section home-section--intro" id="about-me" markdown="1">
{% include_relative includes/intro.md %}
</section>

<section class="home-section home-section--news" id="news" markdown="1">
{% include_relative includes/news.md %}
</section>

<section class="home-section home-section--experience" id="experiences" markdown="1">
{% include_relative includes/experiences.md %}
</section>

<section class="home-section home-section--education" id="educations" markdown="1">
{% include_relative includes/educations.md %}
</section>

<section class="home-section home-section--research" id="research-interests" markdown="1">
{% include_relative includes/interests.md %}
</section>

<section class="home-section home-section--publications" id="publications" markdown="1">
{% include_relative includes/publications.md %}
</section>

<section class="home-section home-section--projects" id="projects" markdown="1">
{% include_relative includes/projects.md %}
</section>

<section class="home-section home-section--honors" id="honors-and-awards" markdown="1">
{% include_relative includes/honors.md %}
</section>

<section class="home-section home-section--activities" id="activities-and-services" markdown="1">
{% include_relative includes/activity.md %}
</section>

<section class="home-section home-section--contact" id="contact" markdown="1">
{% include_relative includes/contact.md %}
</section>


<div class="visitor-insights" aria-live="polite">
  <div class="visitor-insights__summary">
    <span class="visitor-insights__eyebrow">Visitor insights</span>
    <span class="visitor-insights__total" id="visitor-count">—</span>
    <span class="visitor-insights__label">cumulative homepage page views</span>
  </div>
  <div class="visitor-insights__geography">
    <div class="visitor-insights__heading">Estimated visitor distribution by region</div>
    <div class="visitor-insights__countries" id="visitor-countries">
      <span class="visitor-insights__empty">Loading the estimated regional distribution.</span>
    </div>
  </div>
  <span class="visitor-insights__latest" id="visitor-latest">Loading the latest page-view location.</span>
  <span class="visitor-insights__note">Cumulative total includes approximately 15,000 legacy visits estimated from MapMyVisitors (Feb. 9–Apr. 18, 2024) and ClustrMaps (Apr. 18, 2024–approximately May 27, 2026), plus first-party page views recorded since July 27, 2026. Each page load or refresh is counted. Historical regional figures are proportionally reconstructed; flags show representative countries and regions rather than a complete country- or region-level reconstruction.</span>
</div>

<p class="homepage-footer">&copy; Shiyu Hu <span aria-hidden="true">·</span> Last updated: 2026-07</p>

<script src="{{ '/assets/js/visitor-counter.js' | relative_url }}?v={{ site.github.build_revision | default: site.time | date: '%s' }}" defer></script>
<script src="{{ '/assets/js/news-toggle.js' | relative_url }}?v={{ site.github.build_revision | default: site.time | date: '%s' }}" defer></script>
