# 🔍️ Research Interests

<!-- ## The development of artificial intelligence is inherently interconnected with human factors. -->


## Research Foundation

<img align="left" src="../../images/goal.png" width="50%" height="auto" hspace="20" vspace="10">

My previous research has primarily been dedicated to evaluating and exploring machine vision intelligence. This research encompasses various aspects such as task modeling, environment construction, evaluation technique, and human-machine comparisons. I strongly hold the belief that ***<font color=DarkRed>the development of artificial intelligence is inherently interconnected with human factors</font>***. Hence, drawing inspiration from the renowned ***<font color=DarkRed>Turing Test</font>***, I have focused my investigation on the concept of ***<font color=DarkRed>Visual Turing Test</font>***, aiming to integrate human elements into the evaluation of dynamic visual tasks. The ultimate goal of my previous work is to assess and analyze machine vision intelligence by benchmarking against human abilities. I believe that effective evaluation techniques are the foundation for helping us achieve trustworthy and secure artificial general intelligence. 
The following are several key aspects: 

- **What are the abilities of humans? Designing more human-like tasks.**
In my research, I focused on utilizing Visual Object Tracking (VOT) as a representative task to explore dynamic visual abilities. VOT holds a pivotal role in computer vision; however, its original definition imposes excessive constraints that hinder alignment with human dynamic visual tracking abilities. 
To address this problem, I adopted a humanoid modeling perspective and expanded the original VOT definition. By eliminating the presumption of continuous motion, I introduced a more humanoid-oriented [Global Instance Tracking (GIT)](https://huuuuusy.github.io/#GIT) task. This expansion of the research objectives transformed VOT from a ***<font color=DarkRed>perceptual level</font>***, which involves locating targets in short video sequences through visual feature contrasts, to a ***<font color=DarkRed>cognitive level</font>*** that addresses the continuous localization of targets in long videos without presuming continuous motion. 
Building upon this, I endeavored to incorporate semantic information into the GIT task and introduced the [Multi-modal GIT (MGIT)](https://huuuuusy.github.io/#MGIT) task. The goal is to integrate a human-like understanding of long videos with hierarchically structured semantic labels, thereby further advancing the research objectives to include ***<font color=DarkRed>visual reasoning</font>*** within complex spatio-temporal causal relationships.

- **What are the living environments of humans? Constructing more comprehensive and realistic datasets.**
The environment in which humans reside is characterized by complexity and constant change. However, current research predominantly employs static and limited datasets as closed experimental environments. These toy examples fail to provide machines with authentic human-like visual intelligence. 
To address this limitation, I draw inspiration from film theory and propose a framework for decoupling video narrative content. In doing so, I have developed [VideoCube](http://videocube.aitestunion.com/), the largest-scale object tracking benchmark. 
Expanding on this work, I integrate diverse environments from the field of VOT to create [SOTVerse](https://huuuuusy.github.io/#SOTVerse), a dynamic and open task space comprising 12.56 million frames. Within this task space, researchers can efficiently construct different subspaces to train algorithms, thereby improving their ***<font color=DarkRed>visual generalization</font>*** across various scenarios. 
Furthermore, my research also focuses on visual robustness. Leveraging a bio-inspired flapping-wing drone developed by our team, I establish the first flapping-wing drone-based benchmark named [BioDrone](https://huuuuusy.github.io/#BioDrone) to enhance ***<font color=DarkRed>visual robustness</font>*** in challenging environments.

- **How significant is the disparity between human and machine dynamic vision abilities? Utilizing human abilities as a baseline to evaluate machine intelligence.**
Computer scientists typically use large-scale datasets to evaluate machine models, while neuroscientists typically employ simple experimental environments to evaluate human subjects. This discrepancy makes it challenging to integrate human-machine evaluation into a unified framework for comparison and analysis. 
To address the aforementioned issues ([How significant is the disparity between human and machine dynamic vision abilities?](https://huuuuusy.github.io/#VTT-ICLR)), I construct an experimental environment based on SOTVerse to enable a fair comparison between human and machine dynamic visual abilities. These sequences provide a thorough examination of the perceptual abilities, cognitive abilities, and robust tracking abilities of humans and machines. Based on this foundation, a human-machine dynamic visual capability evaluation framework is designed. 
Finally, a fine-grained experimental analysis is carried out from the perspectives of human-machine comparison and human-machine collaboration. The experimental results demonstrate that representative tracking algorithms have gradually narrowed the gap with human subjects. Furthermore, both humans and machines exhibit unique strengths in dynamic visual tasks, suggesting significant potential for human-machine collaboration. 

<img align="left" src="../../images/3E.png" width="100%" height="auto" >

This human-centered evaluation concept is referred to as [Visual Turing Test](https://huuuuusy.github.io/#VTT), and I have presented my thoughts and future prospects in this direction through a comprehensive review on [intelligent evaluation techniques](https://huuuuusy.github.io/#JIG-survey).
These research contents can be summarized using the [3E paradigm](http://metaverse.aitestunion.com/paradigm). In order to enable machines to acquire human ***<font color=DarkRed>abilities</font>***, we need to construct a humanoid proxy ***<font color=DarkRed>task</font>*** and execute it through interactions among the ***<font color=DarkRed>environment</font>***, ***<font color=DarkRed>evaluation</font>***, and ***<font color=DarkRed>executors</font>***. Ultimately, the executors' performance reflects their level of ability, and their upper limit of ability is continuously improved through ongoing iterations. I hope these research can create a comprehensive system that lays a solid research foundation for improving the dynamic visual abilities of machines. 

<!-- ### Ongoing Research

- **Optimizing algorithms from the perspective of human-like modeling: locating target more like humans.** 
Building upon these above works, my [🤝 Collaborators](https://huuuuusy.github.io/#collaborators) and I are focusing on design intelligent tracking algorithms through a human-like modeling approach. For example, we develop [MemVLT](https://huuuuusy.github.io/#MemVLT), a robust visual language tracker based on human memory modelling to enhance tracking performance in complex scenarios. Besides, by considering the cognitive disparities between humans and machines when it comes to dealing with Similar Object Interference (SOI) challenge, we investigate the impact of the SOI challenge on tracking robustness, and construct a [TrackingSOI](https://huuuuusy.github.io/#CSAI23) benchmark by using a data mining method. We then propose the [TransKT](https://huuuuusy.github.io/#SOI) algorithm to enhance the algorithm's perception abilities towards the SOI challenge, aiming to improve its visual robustness.

- **Integrating dynamic visual research and application scenarios: from human-like modeling to human-intelligence interaction.**
The primary objective of human-like modeling is to develop advanced algorithms that enable effective human-machine interaction, serving as the fundamental basis for subsequent collaborations between humans and machines in various scenarios. 
In our recent work, we have integrated language as a communication medium with the dynamic visual task of [unconstrained air-writing](https://huuuuusy.github.io/#AWCV). The overarching goal is to establish a natural and seamless mode of human-machine interaction, specifically catered to intelligent applications like AR/VR. 
Moreover, we are actively expanding the scope of visual language tracking task and exploring the potential development directions from the standpoint of human-machine interaction. We hope to leverage the abilities of Large Language Models (LLMs) and construct more interactive dynamic visual algorithms.

- **Evaluation is science: more comprehensive and in-depth evaluation techniques are needed in the era of LLMs.**
LLMs are gaining increasing popularity in academia and industry due to their exceptional performance across various applications. As LLMs continue to play a vital role in both research and daily use, the need for critical evaluation techniques becomes increasingly apparent. 
My previous research has primarily focused on intelligence evaluation, encompassing abilities related to visual perception, cognition, and reasoning. I will further collaborate with my team to develop more comprehensive intelligence evaluation techniques and conduct a finer-grained analysis of human-machine dynamic visual abilities, providing support for research on model safety and interpretability. 
Furthermore, we are also moving forward to expand the hierarchical levels of evaluation to a deeper dimension—[the psychological dimension](https://huuuuusy.github.io/#PRCV23). By utilizing the dynamic and open environment of psychological sandbox, we aim to integrate technologies from human-computer interaction, game design, psychology, and artificial intelligence to construct a more intelligent [psychological analysis system](https://huuuuusy.github.io/#Sandplay). -->

## Detailed Lists of Current Research Interests

**Data-Centric AI**
- Research on the construction strategy of single-modal and multi-modal datasets incorporating human knowledge structure.
- Research on designing evaluation mechanism for visual robustness, generalization, and safety.

**Visual Turing Test**
- Design of a human-machine universal visual ability evaluation framework.
- Benchmarking the performance of algorithms based on human abilities in perceptual, cognitive, inferential, etc. Analyzing the bottlenecks of algorithms and human subjects in depth, providing guidance for research on human-like modeling, human-machine collaboration, and human-machine integration.

**Video Understanding**
- Exploring using Large Language Models (LLMs) and Large Vision Models (LVMs) for long video understanding.

**Visual Object Tracking (VOT)**
- Research on single object tracking algorithms in general scenes and specific scenarios (such as unmanned aerial vehicles).

**Visual Language Tracking (VLT)**
- Research on multi-modal tracking, video understanding, and visual reasoning tasks based on long video sequences.

**Human-machine Interaction**
- Exploring human-computer interaction patterns in video sequences with various proxy tasks.

**AI4Science**
- **Education:** Research on human-computer interaction (HCI) technology for education scenarios, including designing an intelligent education framework from a multidisciplinary perspective, investigating HCI technology, conducting qualitative and quantitative analysis.
- **Cognitive Science:** Visual task design, environment construction, and human-machine capability analysis based on human-like modeling principles.
- **Medical Science:** Research on medical image processing techniques based on artificial intelligence technologies (e.g., cell segmentation and tracking, denoising of cryo-electron microscopy images).
- **Psychology:** Development of gamified assessment systems targeting psychological dimensions such as anxiety, depression, and obsession, along with research on intelligent psychological evaluation technologies. Exploring using Large Language Models (LLMs) and Large Vision Models (LVMs) for visual comprehension with psychological elements.