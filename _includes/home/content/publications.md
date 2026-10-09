<!--
Publication keyword taxonomy (fixed three-level hierarchy):
1. Research Area: a recognizable, current research field.
2. Capability Problem: the capability being maintained, diagnosed, or evaluated.
3. Research Interface: the paper's principal method, benchmark, or evaluation mechanism.
Use Title Case, keep at most three keywords, and avoid generic catch-all labels.
-->

<div class="publication-filter" role="group" aria-label="Filter publications by research line" hidden>
  <span class="publication-filter__label">Filter by line</span>
  <button type="button" class="publication-filter__option" data-line="all" aria-pressed="true">All</button>
  <button type="button" class="publication-filter__option" data-line="conditions" aria-pressed="false">Across Conditions</button>
  <button type="button" class="publication-filter__option" data-line="time" aria-pressed="false">Over Time</button>
  <button type="button" class="publication-filter__option" data-line="humans" aria-pressed="false">Humans and AI</button>
</div>

{% include home/content/publications/monograph.md %}

{% include home/content/publications/lead-author.md %}

{% include home/publication-browser.html group="lead" note="Selected lead or corresponding-author publications are shown for concise browsing." label="Show all lead or corresponding-author publications" %}

{% include home/content/publications/collaborative.md %}

{% include home/content/publications/workshop.md %}

{% include home/publication-browser.html group="collaborative" note="Selected collaborative publications are shown for concise browsing." label="Show all collaborative publications" %}

{% include home/content/publications/preprints.md %}

{% include home/publication-browser.html group="preprints" note="Selected preprints are shown for concise browsing." label="Show all preprints" %}
