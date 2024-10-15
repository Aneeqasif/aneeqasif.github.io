---
title: TITLE
date: 2023-12-24
categories: [Animal, Insect]
tags: [bee]
---

## Headings

<iframe src="/assets/big.mp4" width="100%" height='800'></iframe>


<iframe
  src="https://jupyterlite.github.io/demo/repl/index.html?kernel=python&theme=JupyterLab Dark&code=
import numpy as np %0A
import matplotlib.pyplot as plt %0A
a = np.arange(15).reshape(3, 5) %0A
a&code=plt.imshow(a) %0A
plt.show()"
  width="100%"
  height="600px"
></iframe>

# H1 - heading
{: .mt-4 .mb-0 }

## H2 - heading
{: data-toc-skip='' .mt-4 .mb-0 }

### H3 - heading
{: data-toc-skip='' .mt-4 .mb-0 }

#### H4 - heading
{: data-toc-skip='' .mt-4 }

## Paragraph

hi threre gybrish Quisque egestas convallis ipsum, ut sollicitudin risus tincidunt a. Maecenas interdum malesuada egestas. Duis consectetur porta risus, sit amet vulputate urna facilisis ac. Phasellus semper dui non purus ultrices sodales. Aliquam ante lorem, ornare a feugiat ac, finibus nec mauris. Vivamus ut tristique nisi. Sed vel leo vulputate, efficitur risus non, posuere mi. Nullam tincidunt bibendum rutrum. Proin commodo ornare sapien. Vivamus interdum diam sed sapien blandit, sit amet aliquam risus mattis. Nullam arcu turpis, mollis quis laoreet at, placerat id nibh. Suspendisse venenatis eros eros.

## Lists

### Ordered list

1. Firstly
2. Secondly
3. Thirdly

### Unordered list

- Chapter
  + Section
    * Paragraph

### ToDo list

- [ ] Job
  + [x] Step 1
  + [x] Step 2
  + [ ] Step 3

### Description list

Sun
: the star around which the earth orbits

Moon
: the natural satellite of the earth, visible by reflected light from the sun

## Block Quote

> This line shows the _block quote_.

## Prompts

> An example showing the `tip` type prompt.
{: .prompt-tip }

> An example showing the `info` type prompt.
{: .prompt-info }

> An example showing the `warning` type prompt.
{: .prompt-warning }

> An example showing the `danger` type prompt.
{: .prompt-danger }

### custom prompts 



<div class="box-info" markdown="1">
<div class="title"> Shakespeare </div>
To be or not to be. That is a question.
</div>

<div class="box-tip" markdown="1">
<div class="title"> Shakespeare </div>
To be or not to be. That is a question.
</div>

<div class="box-warning" markdown="1">
<div class="title"> Shakespeare </div>
To be or not to be. That is a question.
</div>

<div class="box-danger" markdown="1">
<div class="title"> Shakespeare </div>
> To be or not to be. That is a question.  
> --- Shakespeare

$$x^2 + y^2 =z^2$$
</div>


<div class="box-info" markdown="1">
To be or not to be. That is a question.
</div>

<div class="box-tip" markdown="1">
To be or not to be. That is a question.
</div>

<div class="box-warning" markdown="1">
To be or not to be. That is a question.
</div>

<div class="box-danger" markdown="1">
To be or not to be. That is a question.
</div>

> your text
{: .prompt-tip .prompt-tip}


---

<details class="details-block" markdown="1">
<summary>some title </summary>
hi there i am anna

ana the exploreer

</details>
___





## Tables

| Company                      | Contact          | Country |
|:-----------------------------|:-----------------|--------:|
| Alfreds Futterkiste          | Maria Anders     | Germany |
| Island Trading               | Helen Bennett    | UK      |
| Magazzini Alimentari Riuniti | Giovanni Rovelli | Italy   |

## Links

<http://127.0.0.1:4000>

## Footnote

Click the hook will locate the footnote[^footnote], and here is another footnote[^fn-nth-2].

## Inline code

This is an example of `Inline Code`.


### Common

```
This is a common code snippet, without syntax highlight and line number.
```

### Specific Language

```bash
if [ $? -ne 0 ]; then
  echo "The command was not successful.";
  printf "Do you want to continue? (y/n): ";
  #do the needful / exit
fi;
```

## Reverse Footnote

[^footnote]: The footnote source
[^fn-nth-2]: The 2nd footnote source
<div class="YY" markdown="1">

$0
</div>
