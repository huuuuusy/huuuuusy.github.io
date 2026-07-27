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

<section class="home-section home-section--cv" id="cv" markdown="1">
{% include_relative includes/cv.md %}
</section>


<div class="visitor-insights" aria-live="polite">
  <div class="visitor-insights__summary">
    <span class="visitor-insights__eyebrow">Visitor insights</span>
    <span class="visitor-insights__total" id="visitor-count">—</span>
    <span class="visitor-insights__label">homepage visits</span>
    <span class="visitor-insights__coverage" id="visitor-country-total">Collecting geographic distribution</span>
  </div>
  <div class="visitor-insights__geography">
    <div class="visitor-insights__heading">Top countries and regions</div>
    <div class="visitor-insights__countries" id="visitor-countries">
      <span class="visitor-insights__empty">Country-level statistics will appear as visits accumulate.</span>
    </div>
  </div>
  <span class="visitor-insights__note">Anonymous country-level aggregates only; IP addresses are not stored. Recorded from July 2026.</span>
</div>

<p class="homepage-footer">&copy; Shiyu Hu <span aria-hidden="true">·</span> Last updated: 2026-07</p>

<script src="{{ '/assets/js/visitor-counter.js' | relative_url }}?v={{ site.github.build_revision | default: site.time | date: '%s' }}" defer></script>
