<div class="intro-grid">
<div class="intro-primary">
<span class="intro-kicker">Research Fellow · Nanyang Technological University</span>
<h2>Shiyu Hu <span class="intro-name-zh" lang="zh-CN">(胡世宇)</span></h2>
<p>AI is moving from answering single questions to carrying out sustained tasks in open environments: multimodal large models are asked to understand ever longer videos, LLM-based agents to act as people and assist them over long interactions, and unmanned systems to keep perceiving under real changes in lighting and motion. An increasingly discussed bottleneck is that such systems often get the current step right without necessarily keeping the state they should keep. In my work, this shows up in several ways: a tracker often struggles to find its target again after the target leaves the view; a video model can answer correctly while its opening description of the scene no longer holds; and a virtual student played by a large language model may sound like a learner without behaving like one. My research studies <strong>the dynamic states of humans and AI in open environments</strong>: what a system should keep, update, or leave open as conditions change, time passes, and people take part. Using human performance and judgment as reference, I evaluate where these states hold and where they break, model systems that maintain them better, and test them in open-environment visual perception (such as UAV and nighttime tracking), long and streaming video understanding, and education settings where people and AI work together.</p>
</div>
<aside class="intro-profile" aria-label="Current appointment and profile links">
<div class="intro-profile__item">
<span class="intro-profile__label">Current Appointment</span>
<p>Research Fellow at the <a href="https://www.ntu.edu.sg/spms">School of Physical and Mathematical Sciences (SPMS), Nanyang Technological University (NTU)</a>, working with <a href="https://dr.ntu.edu.sg/cris/rp/rp02319">Assoc. Prof. Kang Hao Cheong</a>.</p>

</div>
<div class="intro-profile__item">
<a class="intro-profile__label" href="#background">Education</a>
<p>Ph.D., CASIA, 2024<br>M.Sc., HKU, 2019<br>B.E., BIT, 2017</p>
</div>
{% assign scholar = site.data.scholar %}
<div class="intro-profile__item intro-profile__item--metrics">
<a class="intro-profile__label" href="{{ site.author.googlescholar }}">Citations</a>
<p class="intro-metrics"><span><strong>{% if scholar.citations >= 1000 %}{{ scholar.citations | divided_by: 1000 }},{{ scholar.citations | modulo: 1000 | prepend: '00' | slice: -3, 3 }}{% else %}{{ scholar.citations }}{% endif %}</strong> citations</span><span><strong>{{ scholar.h_index }}</strong> h-index</span><span><strong>{{ scholar.i10_index }}</strong> i10-index</span></p>
<p class="intro-metrics__date">As of {{ scholar.as_of | date: "%-d %B %Y" }}</p>
</div>
<p class="intro-profile__contact">I welcome research discussions and collaborations. Please contact me at <a href="mailto:shiyu.hu@ntu.edu.sg">shiyu.hu@ntu.edu.sg</a>.</p>

<div class="intro-actions">
<a class="intro-action intro-action--primary" href="/files/CV-EN.pdf?v={{ site.github.build_revision | default: site.time | url_encode }}">View CV</a>
<a class="intro-action" href="https://scholar.google.com/citations?user=49W-Rx4AAAAJ">Google Scholar</a>
<a class="intro-action" href="mailto:shiyu.hu@ntu.edu.sg">Email</a>
</div>
</aside>
</div>
