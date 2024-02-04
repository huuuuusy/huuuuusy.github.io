# 🔍️ Research Interests

## The development of artificial intelligence is inherently interconnected with human factors.

My previous research has primarily been dedicated to evaluating and exploring machine vision intelligence. This research encompasses various aspects such as task modeling, environment construction, evaluation technique, and human-machine comparisons. I strongly hold the belief that ***<font color=DarkRed>the development of artificial intelligence is inherently interconnected with human factors</font>***. Hence, drawing inspiration from the renowned ***<font color=DarkRed>Turing Test</font>***, I have focused my investigation on the concept of ***<font color=DarkRed>Visual Turing Test</font>***, aiming to integrate human elements into the examination of dynamic visual tasks. The ultimate objective of my work is to assess and analyze machine vision intelligence by benchmarking against human capabilities.

- **What are the abilities of humans? Designing more human-like tasks.**
  - In my research, I focused on utilizing Visual Object Tracking (VOT) as a representative task to explore dynamic visual capabilities. VOT holds a pivotal role in computer vision; however, its original definition imposes excessive constraints that hinder alignment with human dynamic visual tracking abilities. 
  - To address this problem, I adopted a humanoid modeling perspective and expanded the original VOT definition. By eliminating the presumption of continuous motion, I introduced a more humanoid-oriented [Global Instance Tracking (GIT)](https://huuuuusy.github.io/#GIT) task. This expansion of the research objectives transformed VOT from a ***<font color=DarkRed>perceptual level</font>***, which involves locating targets in short video sequences through visual feature contrasts, to a ***<font color=DarkRed>cognitive level</font>*** that addresses the continuous localization of targets in long videos without presuming continuous motion. 
  - Building upon this, I endeavored to incorporate semantic information into the GIT task and introduced the [Multi-modal GIT (MGIT)](https://huuuuusy.github.io/files/MGIT.pdf) task. The goal is to integrate a human-like understanding of long videos with hierarchically structured semantic labels, thereby further advancing the research objectives to include ***<font color=DarkRed>visual reasoning abilities</font>*** within complex spatio-temporal causal relationships.

- **What are the living environments of humans? Constructing more comprehensive and realistic datasets.**
  - The environment in which humans reside is characterized by complexity and constant change. However, current research predominantly employs static and limited datasets as closed experimental environments. These toy examples fail to provide machines with authentic human-like visual intelligence. 
  - To address this limitation, I draw inspiration from film and television theory and propose a framework for decoupling video narrative content. In doing so, I have developed [VideoCube](http://videocube.aitestunion.com/), the largest-scale object tracking benchmark. 
  - Expanding on this work, I integrate diverse environments from the field of VOT to create [SOTVerse](https://huuuuusy.github.io/files/SOTVerse.pdf), a dynamic and open task space comprising 12.56 million frames. Within this task space, researchers can efficiently construct different subspaces to train algorithms, thereby improving their ***<font color=DarkRed>visual generalization</font>*** across various scenarios. 
  - Furthermore, my research also focuses on visual robustness. Leveraging a bio-inspired flapping-wing drone developed by our team, I establish the first flapping-wing drone-based benchmark named [BioDrone](https://huuuuusy.github.io/files/BioDrone.pdf) to enhance ***<font color=DarkRed>visual robustness</font>*** in challenging environments.

- **How significant is the disparity between human and machine dynamic vision abilities? Utilizing human abilities as a baseline to evaluate machine intelligence.**
  - Computer scientists typically use large-scale datasets to evaluate machine models, while neuroscientists typically employ simple experimental environments to evaluate human subjects. This discrepancy makes it challenging to integrate human-machine evaluation into a unified framework for comparison and analysis. 
  - To address the aforementioned issues ([How significant is the disparity between human and machine dynamic vision abilities?](https://huuuuusy.github.io/files/VTT-ICLR.pdf)), I construct an experimental environment based on SOTVerse to enable a fair comparison between human and machine dynamic visual capabilities. These sequences provide a thorough examination of the perceptual abilities, cognitive abilities, and robust tracking capabilities of humans and machines. Based on this foundation, a human-machine dynamic visual capability evaluation framework is designed. 
  - Finally, a fine-grained experimental analysis is carried out from the perspectives of human-machine comparison and human-machine collaboration. The experimental results demonstrate that representative tracking algorithms have gradually narrowed the gap with human subjects. Furthermore, both humans and machines exhibit unique strengths in dynamic visual tasks, suggesting significant potential for human-machine collaboration. 

This human-centered evaluation concept is referred to as [Visual Turing Test](https://huuuuusy.github.io/files/VTT.pdf), and I have presented my thoughts and future prospects in this direction through a comprehensive review on [intelligent evaluation techniques](https://huuuuusy.github.io/files/JIG-survey.pdf).
These research contents encompass task modeling, environment construction, evaluation techniques, and human-machine comparisons, creating a comprehensive system that lays a solid research foundation for improving the dynamic visual capabilities of machines. 
Building upon this framework, my [🤝 Collaborators](https://huuuuusy.github.io/) and I conducted research on intelligent tracking algorithms through a human-like modeling approach. 
For example, we developed MemTrack, a visual language tracker that leverages the theory of Complementary Learning System to enhance tracking performance in complex scenarios by emulating the human memory system. 
Besides, by considering the cognitive disparities between humans and machines when it comes to dealing with Similar Object Interference (SOI), we investigate the impact of the SOI challenge on tracking robustness, culminating in the development of the TrackingSOI benchmark. We then propose the TransKT algorithm to enhance the algorithm's perception capabilities towards the SOI challenge.

## Detailed Lists

**Visual Object Tracking (VOT)**
- Research on single object tracking algorithms in general scenes and specific scenarios (such as unmanned aerial vehicles).
- Research on the robustness, generalization, and security of single object tracking algorithms.

**Visual Language Tracking (VLT)**
- Research on multi-modal tracking, video understanding, and visual reasoning tasks based on long video sequences.
- Exploring human-computer interaction patterns in long video sequences with visual language tracking as a proxy task.

**Benchmark Construction**
- Research on the construction strategy of single-modal and multi-modal datasets incorporating human knowledge structure.
- Research on designing evaluation mechanism for visual robustness, generalization, and safety.

**Intelligent Evaluation**
- Design of a human-machine universal visual ability evaluation framework.
- Benchmarking the performance of algorithms based on human abilities in perceptual, cognitive, inferential, etc. Analyzing the bottlenecks of algorithms and human subjects in depth, providing guidance for research on human-like modeling, human-machine collaboration, and human-machine integration.

**AI4Science**
- **Cognitive Science:** Visual task design, environment construction, and human-machine capability analysis based on human-like modeling principles.
- **Medical Science:** Research on medical image processing techniques based on artificial intelligence technologies (e.g., cell segmentation and tracking, denoising of cryo-electron microscopy images).
- **Psychology:** Development of gamified assessment systems targeting psychological dimensions such as anxiety, depression, and obsession, along with research on intelligent psychological evaluation technologies.