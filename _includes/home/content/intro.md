<div class="intro-grid">
<div class="intro-primary">
<span class="intro-kicker">Research Fellow · Nanyang Technological University</span>
<h2>Shiyu Hu <span class="intro-name-zh" lang="zh-CN">(胡世宇)</span></h2>
<p>AI is moving from single questions to sustained tasks in open environments. Unmanned systems must keep perceiving as light and motion change, multimodal large models must follow ever longer videos, and LLM-based agents must act as people over long interactions. In such tasks, getting the current step right is not enough; what a system carries forward from earlier steps must still hold. A tracker may lose a target that leaves the view and returns, a video model may answer correctly while its opening description of the scene has gone stale, and a virtual student may sound like a learner without behaving like one.</p>
<p>My research studies <strong>the dynamic states of humans and AI in open environments</strong>, starting from one question: <em>when an AI system gets it right, what has it actually kept?</em> By state I mean what a system should keep, update, or leave open as new observations arrive. A correct answer at one moment cannot show it, so I tell a right answer from a kept state by changing something: the conditions, the time that passes, or the people involved. I design tasks and benchmarks that examine the state itself, with human performance and judgment as the reference where no single ground truth exists. I also build models that hold these states better, and test them in open-environment visual perception, long and streaming video understanding, and human–AI education.</p>
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
<a class="intro-action intro-action--primary" href="/files/CV-EN.pdf">View CV</a>
<a class="intro-action" href="https://scholar.google.com/citations?user=49W-Rx4AAAAJ">Google Scholar</a>
<a class="intro-action" href="mailto:shiyu.hu@ntu.edu.sg">Email</a>
</div>
</aside>
</div>
