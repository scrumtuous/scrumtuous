---
layout: article
 
title: Globbing, Grepping, Aliases
exam_key: braindump
catalog: gcp_generative_ai_leader
---


# Globbing, Grepping, Aliases

### What is Glob?
Globbing is the operation of matching items from a list of strings using wildcard patterns and returning the list of matched items.
It is frequently used to match filenames or filepaths. Glob is a linux function

### What is Grep? 
The grep command is a tool that is used to search for specific words, phrases, or patterns inside text files, and shows the matching lines on your screen.

### How is Glob different from Grep?
Grep relies on regex for pattern matching and text processing in files. It is also a specific command.
Globbing is the process of using wildcards in the command line to find files. You can use "globbing" within other linux commands.

### Syntax and Examples

Grep syntax: ```grep \[options\] pattern \[files\]```

Eg: ```grep -i "hello" gag.txt```

Glob syntax/examples: 

1. ```ls *.txt``` (this will pull up any txt files as * stands in for a file name)
2. ```rm hello?.txt``` (this will remove any files that begin with hello and are followed by a single character as ? stands for a single character)

![alt text](image.png)

### Aliases 
Rather than writing a long sequence of commands, you can use an alias to reference that list of commands. 

Eg: Tiffany is writing a document. She uses "TODO" to mark any tasks she needs to do during her drafting process. She has finished writing her document and wants to remove all instances of "TODO". 
She makes an alias to do this: ```alias alldone = "sed -i s/TODO//g'file.txt'```
Now she can just use the command ```alldone```